#import <Firebase.h>
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"

#import <React/RCTAppSetupUtils.h>

#import "BTAppSwitch.h"
#import "RNFBMessagingModule.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <EmarsysSDK/Emarsys.h>
#import <EmarsysSDK/EMSLogLevel.h>
#import <RNEmarsysWrapper/RNEmarsysEventHandler.h>
#import <RNBranch/RNBranch.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/CoreModulesPlugins.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <ReactCommon/RCTTurboModuleManager.h>

#import <react/config/ReactNativeConfig.h>

@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
  RCTTurboModuleManager *_turboModuleManager;
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
}
@end
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  // firebase
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  
  NSString *appReleaseType = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"APP_RELEASE_TYPE"];
  
  [RNBranch.branch checkPasteboardOnInstall];
  //[RNBranch.branch delayInitToCheckForSearchAds];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  
  [BTAppSwitch setReturnURLScheme:@"au.com.adorebeauty.shop.payments"]; // Braintree config

  [[FBSDKApplicationDelegate sharedInstance] application:application
                             didFinishLaunchingWithOptions:launchOptions]; //facebook-sdk
  
  BOOL IS_DETOX = [[[NSProcessInfo processInfo] arguments] containsObject: @"-detoxServer"];
  //emarsys
  if (IS_DETOX == NO) {
    [self requestPushPermission];
    EMSConfig *config = [EMSConfig makeWithBuilder:^(EMSConfigBuilder * builder) {
      if ([appReleaseType isEqualToString:@"production"]) {
        [builder setMobileEngageApplicationCode:@"EMSC6-61228"];
      } else {
        [builder setMobileEngageApplicationCode:@"EMSDA-4304F"];
      }
      [builder setMerchantId:@"114183C500EBA689"];  // predict merchant ID
      [builder enableConsoleLogLevels:@[EMSLogLevel.trace, EMSLogLevel.debug, EMSLogLevel.info, EMSLogLevel.warn, EMSLogLevel.error, EMSLogLevel.basic]];
    }];
    [Emarsys setupWithConfig:config];
    UNUserNotificationCenter.currentNotificationCenter.delegate = [Emarsys push];
    RNEmarsysEventHandler *rnEMSEventHandler = [RNEmarsysEventHandler allocWithZone: nil];
    [rnEMSEventHandler setEventHandlers];
  }
  
  
  RCTAppSetupPrepareApp(application);

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

#if RCT_NEW_ARCH_ENABLED
  _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
  _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
  _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
  _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:bridge contextContainer:_contextContainer];
  bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;
#endif

  UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"AdoreBeauty", nil);

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [Emarsys.push setPushToken:deviceToken completionBlock:^(NSError *error) {}];
}

//TODO rn 68 update to use without unimodules
//- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
//{
//  NSArray<id<RCTBridgeModule>> *extraModules = [_moduleRegistryAdapter extraModulesForBridge:bridge];
//  // You can inject any extra modules that you would like here, more information at:
//  // https://facebook.github.io/react-native/docs/native-modules-ios.html#dependency-injection
//  return extraModules;
//}

//RCTLinking
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([RNBranch application:application openURL:url options:options]) {
    return YES;
  }

  if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
    return YES;
  }

  return YES;
}
//Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  return [RNBranch continueUserActivity:userActivity];
}

- (void)requestPushPermission
{
  UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:
           (UNAuthorizationOptionAlert +
            UNAuthorizationOptionSound)
     completionHandler:^(BOOL granted, NSError * _Nullable error) {
        // Enable or disable features based on authorization.

    dispatch_async(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication] registerForRemoteNotifications];
    });
  }];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTCxxBridgeDelegate

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
{
  _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge
                                                             delegate:self
                                                            jsInvoker:bridge.jsCallInvoker];
  return RCTAppSetupDefaultJsExecutorFactory(bridge, _turboModuleManager);
}

#pragma mark RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name
{
  return RCTCoreModulesClassProvider(name);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  return nullptr;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                     initParams:
                                                         (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return nullptr;
}

- (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass
{
  return RCTAppSetupDefaultModuleFromClass(moduleClass);
}

#endif

@end
