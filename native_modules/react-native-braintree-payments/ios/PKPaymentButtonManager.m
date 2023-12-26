//
//  ApplePayPaymentButtonManager.m
//  ReactNativePaymentsExample
//

#import <PassKit/PassKit.h>
#import "PKPaymentButtonView.h"
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>

@interface PKPaymentButtonManager : RCTViewManager


@end

@implementation PKPaymentButtonManager


RCT_EXPORT_MODULE(PKPaymentButtonView)

//https://reactnative.dev/docs/0.64/native-components-ios#handling-multiple-native-views
RCT_EXPORT_METHOD(createPaymentRequest:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, PKPaymentButtonView *> *viewRegistry) {
      PKPaymentButtonView *view = viewRegistry[reactTag];
        if (![view isKindOfClass:[PKPaymentButtonView class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNAdvancedWebView, got: %@", view);
        } else {
          [view createPaymentRequest];
        }
    }];
}

RCT_EXPORT_VIEW_PROPERTY(onSelectShippingContact, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSelectShippingMethod, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onApiInit, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAuthorizePayment, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDismiss, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onTransactionComplete, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPaymentPress, RCTBubblingEventBlock)


RCT_CUSTOM_VIEW_PROPERTY(buttonType, NSString, PKPaymentButtonView)
{
  if (json) {
    [view setButtonType:[RCTConvert NSString:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(buttonStyle, NSString, PKPaymentButtonView)
{
  if (json) {
    [view setButtonStyle:[RCTConvert NSString:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(borderRadius, CGFloat, PKPaymentButtonView)
{
  if (json) {
    [view setBorderRadius:[RCTConvert CGFloat:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(clientToken, NSString, PKPaymentButtonView)
{
  if(json){
    [view setClientToken:[RCTConvert NSString:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(shippingMethods, NSDictionary, PKPaymentButtonView)
{
  if(json){
    [view setShippingMethods:[RCTConvert NSArray:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(paymentItems, NSDictionary, PKPaymentButtonView)
{
  if(json){
    [view setPaymentItems:[RCTConvert NSArray:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(disabled, NSString, PKPaymentButtonView)
{
  if(json){
    [view setDisabled:[RCTConvert BOOL:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(enableShipping, NSString, PKPaymentButtonView)
{
  if(json){
    [view setEnableShipping:[RCTConvert BOOL:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(transaction, NSDictionary, PKPaymentButtonView)
{
  if(json){
    [view setTransaction:[RCTConvert NSDictionary:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(shippingContact, NSDictionary, PKPaymentButtonView)
{
  if(json){
    [view setShippingContact:[RCTConvert NSDictionary:json]];
  }
}

//RCT_EXPORT_METHOD(callNativeMethod:(nonnull NSNumber*) reactTag) {
//    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
//      PKPaymentButtonView *view = viewRegistry[reactTag];
//        if (!view || ![view isKindOfClass:[PKPaymentButtonView class]]) {
//            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
//            return;
//        }
//        [view setShippingContact];
//    }];
//
//}


- (UIView *) view
{
  return [PKPaymentButtonView new];
}


@end
