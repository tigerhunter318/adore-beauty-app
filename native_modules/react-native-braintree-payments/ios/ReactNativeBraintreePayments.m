// ReactNativeBraintreePayments.m
#import "ReactNativeBraintreePayments.h"

@implementation ReactNativeBraintreePayments


RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(canMakeApplePayments :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject ) {
  resolve(@([PKPaymentAuthorizationViewController canMakePayments]));
}


@end
