// ReactNativePartnerize.m

#import <React/RCTBridge.h>

@interface RCT_EXTERN_MODULE(ReactNativePartnerize, NSObject)

RCT_EXTERN_METHOD(isLoggingEnabled:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(startConversion
                  :(NSString *)urlString
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(completeConversion
                  :(NSDictionary *)cartData
                  :(NSString *)clickRef
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  );


@end
