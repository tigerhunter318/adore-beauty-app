// ReactNativeBraintreePayments.h

#import <React/RCTView.h>
#import <PassKit/PassKit.h>
#import <React/RCTBridge.h>
#import <React/RCTUtils.h>
#import <React/RCTLog.h>

#import "BraintreeCore.h"
#import "BTCardNonce.h"
#import "BTDataCollector.h"
#import "BraintreeApplePay.h"


API_AVAILABLE(ios(11.0))
@interface PKPaymentButtonView : RCTView <PKPaymentAuthorizationViewControllerDelegate>

@property (strong, nonatomic) NSString *buttonStyle;
@property (strong, nonatomic) NSString *buttonType;
@property (nonatomic) CGFloat borderRadius;
@property (nonatomic, readonly) PKPaymentButton *button;

@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@property (nonatomic, copy) RCTBubblingEventBlock onPaymentPress;
@property (nonatomic, copy) RCTBubblingEventBlock onSelectShippingContact;
@property (nonatomic, copy) RCTBubblingEventBlock onSelectShippingMethod;
@property (nonatomic, copy) RCTBubblingEventBlock onApiInit;
@property (nonatomic, copy) RCTBubblingEventBlock onAuthorizePayment;
@property (nonatomic, copy) RCTBubblingEventBlock onDismiss;
@property (nonatomic, copy) RCTBubblingEventBlock onTransactionComplete;



@property (strong, nonatomic) NSString *clientToken;
@property (strong, nonatomic) NSArray *shippingMethods;
@property (strong, nonatomic) NSArray *paymentItems;
@property (strong, nonatomic) NSDictionary *transaction;
@property (strong, nonatomic) NSDictionary *shippingContact;

@property (nonatomic,getter=isEnabled) BOOL disabled;
@property (nonatomic,getter=isEnabled) BOOL enableShipping;

//PKPaymentRequest
@property (nonatomic, strong) PKPaymentRequest *paymentRequest;
@property (nonatomic, strong) BTApplePayClient *applePayClient;
@property (nonatomic, strong) BTAPIClient *apiClient;

@property (nonatomic, copy) void (^shippingContactCompletion)(PKPaymentRequestShippingContactUpdate *update);
@property (nonatomic, copy) void (^paymentMethodCompletion)(PKPaymentRequestPaymentMethodUpdate *update);
@property (nonatomic, copy) void (^shippingMethodCompletion)(PKPaymentRequestShippingMethodUpdate *update);
@property (nonatomic, copy) void (^authorizeMethodCompletion)(PKPaymentAuthorizationResult *update);

- (void)createPaymentRequest;
- (void)initApiWithAuthorization:(NSString *)clientToken;


//PKPaymentAuthorizationResult
@end
