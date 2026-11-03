import UIKit
import AVFoundation
import StoreKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        useAmbientAudio()
        return true
    }

    // The game's music and sound are "ambient" audio: they play alongside the player's own music
    // (Apple Music, Spotify, YouTube) instead of pausing it, and the silent switch mutes them.
    private func useAmbientAudio() {
        try? AVAudioSession.sharedInstance().setCategory(.ambient, mode: .default, options: [])
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
        useAmbientAudio()
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}

// The game's own view controller: Capacitor's, with the review plugin added.
// (Main.storyboard points here.)
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(MudReviewPlugin())
    }
}

// Lets the game ask Apple for its rating pop-up, and open the App Store review page.
// Apple decides whether the pop-up really shows (at most three times a year for each player).
@objc(MudReviewPlugin)
public class MudReviewPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "MudReviewPlugin"
    public let jsName = "MudReview"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestReview", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openReviewPage", returnType: CAPPluginReturnPromise)
    ]

    @objc func requestReview(_ call: CAPPluginCall) {
        call.resolve()
        Task { @MainActor in
            let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
            guard let scene = scenes.first(where: { $0.activationState == .foregroundActive }) ?? scenes.first else { return }
            if #available(iOS 16.0, *) {
                AppStore.requestReview(in: scene)
            } else {
                SKStoreReviewController.requestReview(in: scene)
            }
        }
    }

    // Finds this app's App Store page from its bundle ID, then opens "Write a Review" there.
    @objc func openReviewPage(_ call: CAPPluginCall) {
        call.resolve()
        let bundle = Bundle.main.bundleIdentifier ?? ""
        guard let lookup = URL(string: "https://itunes.apple.com/lookup?bundleId=\(bundle)") else { return }
        URLSession.shared.dataTask(with: lookup) { data, _, _ in
            var target = URL(string: "itms-apps://apps.apple.com/search?term=Mud%20%26%20Crowns")
            if let data = data,
               let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let results = json["results"] as? [[String: Any]],
               let id = results.first?["trackId"] as? Int {
                target = URL(string: "itms-apps://apps.apple.com/app/id\(id)?action=write-review")
            }
            guard let dest = target else { return }
            Task { @MainActor in
                UIApplication.shared.open(dest)
            }
        }.resume()
    }
}
