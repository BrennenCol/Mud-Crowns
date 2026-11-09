"""Upload the store screenshots to App Store Connect, replacing the old ones.

Runs in GitHub Actions (Store screenshots workflow) with the same App Store Connect API key as the iPhone build.
It finds the app version you can still edit (Prepare for Submission, or one you removed from review), and for each
language on it replaces the iPhone screenshots with the PNGs in the folder given, in file-name order.

Usage: python upload_screenshots.py store/iphone
Environment: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8, and optionally DISPLAY_TYPE (e.g. APP_IPHONE_61).
"""
import base64
import glob
import hashlib
import json
import os
import re
import sys
import textwrap
import time

import jwt
import requests

API = 'https://api.appstoreconnect.apple.com'
EDITABLE = {'PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED', 'INVALID_BINARY', 'READY_FOR_REVIEW'}
http = requests.Session()


def clean_key(raw):
    # The secret is pasted by hand, so its line breaks and spaces are often mangled. Rebuild a proper key file,
    # the same way the iPhone build does.
    body = re.sub(r'-----\s*(BEGIN|END)[^-]*-----', '', raw.replace('\\n', '\n'))
    body = re.sub(r'[^A-Za-z0-9+/=]', '', body)
    try:
        der = base64.b64decode(body, validate=True)
    except Exception:
        der = b''
    if len(der) < 100 or der[:1] != b'\x30':
        sys.exit(f'::error::APPSTORE_KEY_P8 does not look like the .p8 key file ({len(body)} key characters found).')
    return '-----BEGIN PRIVATE KEY-----\n' + '\n'.join(textwrap.wrap(body, 64)) + '\n-----END PRIVATE KEY-----\n'


KEY = None


def token():
    global KEY
    if KEY is None:
        KEY = clean_key(os.environ['ASC_KEY_P8'])
    now = int(time.time())
    return jwt.encode({'iss': os.environ['ASC_ISSUER_ID'].strip(), 'iat': now, 'exp': now + 1000, 'aud': 'appstoreconnect-v1'},
                      KEY, algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID'].strip(), 'typ': 'JWT'})


def call(method, path, body=None):
    headers = {'Authorization': 'Bearer ' + token()}
    if body is not None:
        headers['Content-Type'] = 'application/json'
    r = http.request(method, API + path, headers=headers, data=json.dumps(body) if body is not None else None, timeout=60)
    if r.status_code >= 400:
        print(f'::error::{method} {path} answered {r.status_code}: {r.text[:1500]}')
        sys.exit(1)
    return r.json() if r.text else {}


def main(folder):
    files = sorted(glob.glob(os.path.join(folder, '*.png')))
    if not files:
        sys.exit(f'::error::No PNG files in {folder}')
    bundle = json.load(open('capacitor.config.json'))['appId']
    apps = call('GET', f'/v1/apps?filter[bundleId]={bundle}')['data']
    if not apps:
        sys.exit(f'::error::No app with bundle ID {bundle} in App Store Connect')
    app = apps[0]['id']

    versions = call('GET', f'/v1/apps/{app}/appStoreVersions?filter[platform]=IOS&limit=20')['data']
    for v in versions:
        a = v['attributes']
        print(f"Version {a.get('versionString')}: {a.get('appVersionState') or a.get('appStoreState')}")
    editable = [v for v in versions if (v['attributes'].get('appVersionState') or v['attributes'].get('appStoreState')) in EDITABLE]
    if not editable:
        print('::error::No version can be edited right now. Apple locks screenshots while a version is waiting for or in '
              'review, and on the live version. Remove the version from review, or create the next version, then run this again.')
        sys.exit(1)
    version = editable[0]
    print(f"Uploading to version {version['attributes']['versionString']}")

    want = os.environ.get('DISPLAY_TYPE') or ''
    locs = call('GET', f"/v1/appStoreVersions/{version['id']}/appStoreVersionLocalizations")['data']
    for loc in locs:
        lang = loc['attributes']['locale']
        sets = call('GET', f"/v1/appStoreVersionLocalizations/{loc['id']}/appScreenshotSets?limit=50")['data']
        iphone = [s for s in sets if s['attributes']['screenshotDisplayType'].startswith('APP_IPHONE')]
        target = None
        if want:
            target = next((s for s in sets if s['attributes']['screenshotDisplayType'] == want), None)
        if not target:
            target = next((s for s in iphone if s['attributes']['screenshotDisplayType'] == 'APP_IPHONE_61'), None)
        if not target and iphone:
            target = iphone[0]
        if not target:
            target = call('POST', '/v1/appScreenshotSets', {'data': {'type': 'appScreenshotSets',
                          'attributes': {'screenshotDisplayType': want or 'APP_IPHONE_61'},
                          'relationships': {'appStoreVersionLocalization': {'data': {'type': 'appStoreVersionLocalizations', 'id': loc['id']}}}}})['data']
        kind = target['attributes']['screenshotDisplayType']
        print(f'{lang}: replacing the {kind} screenshots')

        old = call('GET', f"/v1/appScreenshotSets/{target['id']}/appScreenshots?limit=50")['data']
        for s in old:
            call('DELETE', f"/v1/appScreenshots/{s['id']}")
        print(f'  removed {len(old)} old')

        ids = []
        for path in files:
            raw = open(path, 'rb').read()
            name = os.path.basename(path)
            shot = call('POST', '/v1/appScreenshots', {'data': {'type': 'appScreenshots',
                        'attributes': {'fileName': name, 'fileSize': len(raw)},
                        'relationships': {'appScreenshotSet': {'data': {'type': 'appScreenshotSets', 'id': target['id']}}}}})['data']
            for op in shot['attributes']['uploadOperations']:
                part = raw[op['offset']:op['offset'] + op['length']]
                r = http.request(op['method'], op['url'], data=part,
                                 headers={h['name']: h['value'] for h in op.get('requestHeaders', [])}, timeout=120)
                if r.status_code >= 400:
                    sys.exit(f'::error::Upload of {name} failed: {r.status_code} {r.text[:500]}')
            call('PATCH', f"/v1/appScreenshots/{shot['id']}", {'data': {'type': 'appScreenshots', 'id': shot['id'],
                 'attributes': {'uploaded': True, 'sourceFileChecksum': hashlib.md5(raw).hexdigest()}}})
            state = ''
            for _ in range(30):
                a = call('GET', f"/v1/appScreenshots/{shot['id']}")['data']['attributes']
                state = (a.get('assetDeliveryState') or {}).get('state', '')
                if state in ('COMPLETE', 'FAILED'):
                    break
                time.sleep(2)
            if state == 'FAILED':
                errs = (a.get('assetDeliveryState') or {}).get('errors')
                sys.exit(f'::error::Apple did not accept {name}: {errs}')
            print(f'  {name}: {state or "uploaded"}')
            ids.append(shot['id'])

        call('PATCH', f"/v1/appScreenshotSets/{target['id']}/relationships/appScreenshots",
             {'data': [{'type': 'appScreenshots', 'id': i} for i in ids]})
        print(f'  {len(ids)} screenshots in order')
    print('Done. Check them in App Store Connect, under the version, Previews and Screenshots.')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'store/iphone')
