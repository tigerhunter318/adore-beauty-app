#import "PKPaymentButtonView.h"

NSString * const DEFAULT_BUTTON_TYPE = @"plain";
NSString * const DEFAULT_BUTTON_STYLE = @"black";
CGFloat const DEFAULT_BORDER_RADIUS = 4.0;

/*
 DebugLog https://stackoverflow.com/a/18980789/1721636
 */
#ifdef DEBUG
  #define DebugLog(...) RCTLogInfo(@"**DebugLog %s %@", __PRETTY_FUNCTION__, [NSString stringWithFormat:__VA_ARGS__])
#else
  #define DebugLog(...) do { } while (0)
#endif

@implementation PKPaymentButtonView

@synthesize buttonType = _buttonType;
@synthesize buttonStyle = _buttonStyle;
@synthesize borderRadius = _borderRadius;
@synthesize button = _button;

//
@synthesize clientToken = _clientToken;
@synthesize shippingMethods = _shippingMethods;
@synthesize paymentItems = _paymentItems;
@synthesize transaction = _transaction;
@synthesize disabled = _disabled;

@synthesize shippingContact = _shippingContact;
@synthesize enableShipping = _enableShipping;


- (instancetype) init {
  self = [super init];
  [self setButtonType:DEFAULT_BUTTON_TYPE andStyle:DEFAULT_BUTTON_STYLE withRadius:DEFAULT_BORDER_RADIUS];

  return self;
}


- (void)setButtonType:(NSString *) value {
  if (_buttonType != value) {
    [self setButtonType:value andStyle:_buttonStyle withRadius:_borderRadius];
  }

  _buttonType = value;
}

- (void)setButtonStyle:(NSString *) value {
  if (_buttonStyle != value) {
    [self setButtonType:_buttonType andStyle:value withRadius:_borderRadius];
  }

  _buttonStyle = value;
}

- (void)setBorderRadius:(CGFloat) value {
  if(_borderRadius != value) {
    [self setButtonType:_buttonType andStyle:_buttonStyle withRadius:value];
  }

  _borderRadius = value;
}

/**
 * PKPayment button cannot be modified. Due to this limitation, we have to
 * unmount existing button and create a new one whenever its style and/or
 * type is changed.
 *
 * // https://developer.apple.com/design/human-interface-guidelines/apple-pay/overview/buttons-and-marks/#button-types
 */
- (void)setButtonType:(NSString *) buttonType andStyle:(NSString *) buttonStyle withRadius:(CGFloat) cornerRadius {
  
  if (![PKPaymentAuthorizationViewController canMakePayments]) {
      return;
  }
  
  for (UIView *view in self.subviews) {
    [view removeFromSuperview];
  }

  PKPaymentButtonType type;
  PKPaymentButtonStyle style;


  if ([buttonType isEqualToString: @"buy"]) {
    type = PKPaymentButtonTypeBuy;
  } else if ([buttonType isEqualToString: @"setUp"]) {
    type = PKPaymentButtonTypeSetUp;
  } else if ([buttonType isEqualToString: @"inStore"]) {
    type = PKPaymentButtonTypeInStore;
  } else if ([buttonType isEqualToString: @"donate"]) {
    type = PKPaymentButtonTypeDonate;
  } else if ([buttonType isEqualToString: @"checkout"]) {
    type = PKPaymentButtonTypeCheckout;
  } else if ([buttonType isEqualToString: @"continue"]) {
    type = PKPaymentButtonTypeContinue;
  } else if ([buttonType isEqualToString: @"donate"]) {
    type = PKPaymentButtonTypeDonate;
  } else if ([buttonType isEqualToString: @"pay"]) {
    type = PKPaymentButtonTypeInStore;
  }
  else {
    type = PKPaymentButtonTypePlain;
  }

  if ([buttonStyle isEqualToString: @"white"]) {
    style = PKPaymentButtonStyleWhite;
  } else if ([buttonStyle isEqualToString: @"whiteOutline"]) {
    style = PKPaymentButtonStyleWhiteOutline;
  } else {
    style = PKPaymentButtonStyleBlack;
  }

  _button = [[PKPaymentButton alloc] initWithPaymentButtonType:type paymentButtonStyle:style];
  [_button addTarget:self action:@selector(handleButtonPress:) forControlEvents:UIControlEventTouchUpInside];

  _button.cornerRadius = cornerRadius;
  _button.layer.cornerRadius = cornerRadius;
  _button.layer.masksToBounds = true;

  [self setDisabled:YES];

  [self addSubview:_button];
}

/**
 * Respond to touch event
 */
- (void)handleButtonPress:(PKPaymentButton *)button {
  
  if(self.onPress){
    self.onPress(nil);
  }
  
  if(! self->_disabled){
    if(self.onPaymentPress){
      self.onPaymentPress(nil);
    }else{
      [self createPaymentRequest];
    }
    
  }
}

/**
 * Set button frame to what React sets for parent view.
 */
- (void)layoutSubviews
{
  [super layoutSubviews];
  _button.frame = self.bounds;
}

//

#pragma mark Setters

- (void)setDisabled:(BOOL)disabled{
  _disabled = disabled;
  _button.enabled = !disabled;
}

- (void)setEnableShipping:(BOOL)enabled{
  _enableShipping = enabled;
}

- (void)setShippingContact:(NSDictionary *)shippingContact{
  _shippingContact = shippingContact;
}

- (void)setClientToken:(NSString *)clientToken {
  _clientToken = clientToken;
  [self initApiWithAuthorization:_clientToken];
}

- (void)setPaymentItems:(NSArray *)items {

  NSMutableArray *newItems = [NSMutableArray array];
  for (NSDictionary *item in items) {
    PKPaymentSummaryItem *paymentSummaryItem = [PKPaymentSummaryItem summaryItemWithLabel:item[@"label"] amount:[self toDecimal:item[@"amount"]]];
    [newItems addObject: paymentSummaryItem];
  }

  _paymentItems = newItems;

  PKPaymentRequestShippingMethodUpdate *update = [PKPaymentRequestShippingMethodUpdate new];
  update.paymentSummaryItems = _paymentItems;

  if(self.shippingMethodCompletion){
    self.shippingMethodCompletion(update);
  }
}

- (void)setShippingMethods:(NSArray *)items {
  

  NSMutableArray *newItems = [NSMutableArray array];
  for (NSDictionary *item in items) {
    PKShippingMethod *shippingMethod = [PKShippingMethod summaryItemWithLabel:item[@"summary"] amount:[self toDecimal:item[@"amount"]]];
    shippingMethod.detail = item[@"detail"];
    shippingMethod.identifier = item[@"identifier"];
    [newItems addObject: shippingMethod];
  }

  _shippingMethods = newItems;

  

  if(self.shippingContactCompletion){
    PKPaymentRequestShippingContactUpdate *update = [PKPaymentRequestShippingContactUpdate new];
    update.shippingMethods = _shippingMethods;
    update.paymentSummaryItems = _paymentItems;
    self.shippingContactCompletion(update);
  }
}

- (void)setTransaction:(NSDictionary *)transaction {
  if(self.authorizeMethodCompletion){
    BOOL success = [transaction[@"success"] boolValue];

    if(success){
      self.authorizeMethodCompletion([[PKPaymentAuthorizationResult alloc] initWithStatus:PKPaymentAuthorizationStatusSuccess errors:nil]);
    }else{
      self.authorizeMethodCompletion([[PKPaymentAuthorizationResult alloc] initWithStatus:PKPaymentAuthorizationStatusFailure errors:nil]);
    }
    

    if(self.onTransactionComplete){
      self.onTransactionComplete(@{
        @"transaciton": transaction
      });
    }
  }
}

-(PKPaymentSummaryItem *) grandTotalItem {
  return [self.paymentItems lastObject];
}

#pragma mark BraintreeApi

- (void)initApiWithAuthorization:(NSString *)clientToken {
  self.apiClient = [[BTAPIClient alloc] initWithAuthorization:clientToken];
  if(self.apiClient){

    self.applePayClient = [[BTApplePayClient alloc] initWithAPIClient:self.apiClient];
    _button.enabled = YES;

    if(self.onApiInit){
      self.onApiInit(@{
        @"success" : @(YES),
        @"clientToken" : clientToken,
      });
    }
  }
}

- (void)createPaymentRequest {
  
  [self.applePayClient paymentRequest:^(PKPaymentRequest * _Nullable paymentRequest, NSError * _Nullable error) {


    if (error) {
      //TODO, do something with error
      RCTLogInfo(@"[PKPaymentButtonView] createPaymentRequest error: %@", error);
      return;
    }

    paymentRequest.merchantCapabilities = PKMerchantCapability3DS;
    paymentRequest.paymentSummaryItems = self.paymentItems;
    
    
    DebugLog(@"grand total: %@ %@", [self grandTotalItem].label, [self grandTotalItem].amount);
    
    if(self->_enableShipping){
      paymentRequest.requiredShippingContactFields = [[NSSet alloc] initWithObjects: PKContactFieldPostalAddress, PKContactFieldEmailAddress, PKContactFieldPhoneNumber, nil];
      paymentRequest.requiredBillingContactFields = [[NSSet alloc] initWithObjects: PKContactFieldPostalAddress, PKContactFieldName, nil];
      
      paymentRequest.shippingMethods = self.shippingMethods;

      if ([paymentRequest respondsToSelector:@selector(setShippingType:)]) {
        paymentRequest.shippingType = PKShippingTypeDelivery;
      }
      
      if(self->_shippingContact){
        PKContact *contact = [self dictionaryToPkContact:self->_shippingContact];
        paymentRequest.billingContact = contact;
        paymentRequest.shippingContact = contact;
        NSLog(@"set paymentRequest shippingContact %@", contact);
      }
    }
    

    if(self.shippingContactCompletion){
      self.shippingContactCompletion = nil;
    }
    if(self.shippingMethodCompletion){
      self.shippingMethodCompletion = nil;
    }

    PKPaymentAuthorizationViewController *paymentViewController = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:paymentRequest];
    paymentViewController.delegate = self;


    NSLog(@"Presenting Apple Pay Sheet");


    UIViewController *rootViewController = RCTPresentedViewController();
    [rootViewController presentViewController:paymentViewController animated:YES completion:^{

    }];


  }];
}




#pragma mark PKPaymentAuthorizationViewControllerDelegate

- (void)paymentAuthorizationViewControllerDidFinish:(__unused PKPaymentAuthorizationViewController *)controller {

  NSLog(@"paymentAuthorizationViewControllerDidFinish");
  [controller dismissViewControllerAnimated:YES completion:nil];
  if(self.onDismiss){
    self.onDismiss(@{
      @"success" : @(YES),
    });
  }
}


- (void)paymentAuthorizationViewController:(__unused PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                   handler:(void (^)(PKPaymentAuthorizationResult * _Nonnull))completion {
  NSLog(@"Apple Pay Did Authorize Payment");
  [self.applePayClient tokenizeApplePayPayment:payment completion:^(BTApplePayCardNonce * _Nullable tokenizedApplePayPayment, NSError * _Nullable error) {
    if (error) {
      completion([[PKPaymentAuthorizationResult alloc] initWithStatus:PKPaymentAuthorizationStatusFailure errors:nil]);
    } else {
      self.authorizeMethodCompletion = completion;
      DebugLog(@"grand total: %@ %@", [self grandTotalItem].label, [self grandTotalItem].amount);

      if(self.onAuthorizePayment){
        self.onAuthorizePayment(@{
          @"success" : @(YES),
          @"nonce" : tokenizedApplePayPayment.nonce,
          @"amount" : [self grandTotalItem].amount,
          @"billingContact":[self contactToDictionary:payment.billingContact],
          @"shippingContact":[self contactToDictionary:payment.shippingContact],
          @"shippingMethod":[self shippingMethodToDictionary:payment.shippingMethod],
        });
      }

    }
  }];
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                  didSelectShippingContact:(PKContact *)contact
                                   handler:(void (^)(PKPaymentRequestShippingContactUpdate *update))completion  API_AVAILABLE(ios(11.0)){

  NSLog(@"[paymentAuthorizationViewController] didSelectShippingContact %@", contact);
  self.shippingContactCompletion = completion;
  if(self.onSelectShippingContact){
    self.onSelectShippingContact([self contactToDictionary:contact]);
  }
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                    didSelectPaymentMethod:(PKPaymentMethod *)paymentMethod
                                   handler:(void (^)(PKPaymentRequestPaymentMethodUpdate *update))completion API_AVAILABLE(macos(11.0), ios(11.0), watchos(4.0)){
  NSLog(@"[paymentAuthorizationViewController] didSelectPaymentMethod %@", paymentMethod);
  completion(nil);
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                   didSelectShippingMethod:(PKShippingMethod *)shippingMethod
                                   handler:(void (^)(PKPaymentRequestShippingMethodUpdate *update))completion  API_AVAILABLE(ios(11.0)){
  NSLog(@"[paymentAuthorizationViewController] didSelectShippingMethod %@", shippingMethod);
  self.shippingMethodCompletion = completion;
  if(self.onSelectShippingMethod){
    self.onSelectShippingMethod([self shippingMethodToDictionary:shippingMethod]);
  }
}

- (void)paymentAuthorizationViewControllerWillAuthorizePayment:(__unused PKPaymentAuthorizationViewController *)controller {
  NSLog(@"Apple Pay will Authorize Payment");
}

#pragma mark convertJson

-(NSDictionary*)shippingMethodToDictionary:(PKShippingMethod *)shippingMethod {
  return @{
    @"identifier" : shippingMethod.identifier ?: @"",
    @"detail" : shippingMethod.detail ?: @"",
  };
}

-(NSDictionary*)contactToDictionary:(PKContact *)contact {

    NSString *namePrefix = contact.name.namePrefix;
    NSString *givenName = contact.name.givenName;
    NSString *middleName = contact.name.middleName;
    NSString *familyName = contact.name.familyName;
    NSString *nameSuffix = contact.name.nameSuffix;
    NSString *nickname = contact.name.nickname;
    NSString *street = contact.postalAddress.street;
    NSString *subLocality = contact.postalAddress.subLocality;
    NSString *city = contact.postalAddress.city;
    NSString *subAdministrativeArea = contact.postalAddress.subAdministrativeArea;
    NSString *state = contact.postalAddress.state;
    NSString *postalCode = contact.postalAddress.postalCode;
    NSString *country = contact.postalAddress.country;
    NSString *ISOCountryCode = contact.postalAddress.ISOCountryCode;
    NSString *phoneNumber = contact.phoneNumber.stringValue;
    NSString *emailAddress = contact.emailAddress;

    NSDictionary *dict = @{
         @"name" : @{
                 @"namePrefix" : namePrefix ?: @"",
                 @"givenName" : givenName ?: @"",
                 @"middleName" : middleName ?: @"",
                 @"familyName" : familyName ?: @"",
                 @"nameSuffix" : nameSuffix ?: @"",
                 @"nickname" : nickname ?: @"",
         },
         @"postalAddress" : @{
                 @"street" : street ?: @"",
                 @"subLocality" : subLocality ?: @"",
                 @"city" : city ?: @"",
                 @"subAdministrativeArea" : subAdministrativeArea ?: @"",
                 @"state" : state ?: @"",
                 @"postalCode" : postalCode ?: @"",
                 @"country" : country ?: @"",
                 @"ISOCountryCode" : ISOCountryCode ?: @""
         },
         @"phoneNumber" : phoneNumber ?: @"",
         @"emailAddress" : emailAddress ?: @""
    };

  return dict;

}
//https://github.com/PersianDevelopers/ApplePay-Manager/blob/1c65eb799a42df183ee8bbcbd46db6b098ca1a8c/Address.m#L24
-(PKContact*)dictionaryToPkContact:(NSDictionary *)dict {
  
  PKContact *contact = [[PKContact alloc]init];
  
  if(dict[@"emailAddress"]){
    contact.emailAddress = dict[@"emailAddress"];
  }
  if(dict[@"phoneNumber"]){
    contact.phoneNumber = [CNPhoneNumber phoneNumberWithStringValue:dict[@"phoneNumber"]];
  }
  if(dict[@"name"][@"givenName"] && dict[@"name"][@"familyName"]){
    NSPersonNameComponents *name = [[NSPersonNameComponents alloc]init];
    name.givenName = dict[@"name"][@"givenName"];
    name.familyName = dict[@"name"][@"familyName"];
    
    contact.name = name;
  }
  if(dict[@"postalAddress"][@"street"] && dict[@"postalAddress"][@"state"]){
    CNMutablePostalAddress *postalAddress = [[CNMutablePostalAddress alloc]init];
    postalAddress.street = dict[@"postalAddress"][@"street"];
    postalAddress.subLocality = dict[@"postalAddress"][@"subLocality"];
    postalAddress.city = dict[@"postalAddress"][@"city"];
    postalAddress.subAdministrativeArea = dict[@"postalAddress"][@"subAdministrativeArea"];
    postalAddress.state = dict[@"postalAddress"][@"state"];
    postalAddress.postalCode = dict[@"postalAddress"][@"postalCode"];
    postalAddress.country = dict[@"postalAddress"][@"country"];
    postalAddress.ISOCountryCode = dict[@"postalAddress"][@"ISOCountryCode"];
    contact.postalAddress = postalAddress;
  }
  
  return contact;
}

- (NSDictionary *_Nonnull)paymentMethodToString:(PKPaymentMethod *_Nonnull)paymentMethod
{
    NSMutableDictionary *result = [[NSMutableDictionary alloc]initWithCapacity:4];

    if(paymentMethod.displayName) {
        [result setObject:paymentMethod.displayName forKey:@"displayName"];
    }
    if (paymentMethod.network) {
        [result setObject:paymentMethod.network forKey:@"network"];
    }
    NSString *type = [self paymentMethodTypeToString:paymentMethod.type];
    [result setObject:type forKey:@"type"];
    if(paymentMethod.paymentPass) {
        NSDictionary *paymentPass = [self paymentPassToDictionary:paymentMethod.paymentPass];
        [result setObject:paymentPass forKey:@"paymentPass"];
    }

    return result;
}

- (NSString *_Nonnull)paymentMethodTypeToString:(PKPaymentMethodType)paymentMethodType
{
    NSArray *arr = @[@"PKPaymentMethodTypeUnknown",
                     @"PKPaymentMethodTypeDebit",
                     @"PKPaymentMethodTypeCredit",
                     @"PKPaymentMethodTypePrepaid",
                     @"PKPaymentMethodTypeStore"];
    return (NSString *)[arr objectAtIndex:paymentMethodType];
}

- (NSDictionary *_Nonnull)paymentPassToDictionary:(PKPaymentPass *_Nonnull)paymentPass
{
    return @{
        @"primaryAccountIdentifier" : paymentPass.primaryAccountIdentifier,
        @"primaryAccountNumberSuffix" : paymentPass.primaryAccountNumberSuffix,
        @"deviceAccountIdentifier" : paymentPass.deviceAccountIdentifier,
        @"deviceAccountNumberSuffix" : paymentPass.deviceAccountNumberSuffix,
        @"activationState" : [self paymentPassActivationStateToString:paymentPass.activationState]
    };
}

- (NSString *_Nonnull)paymentPassActivationStateToString:(PKPaymentPassActivationState)paymentPassActivationState
{
    NSArray *arr = @[@"PKPaymentPassActivationStateActivated",
                     @"PKPaymentPassActivationStateRequiresActivation",
                     @"PKPaymentPassActivationStateActivating",
                     @"PKPaymentPassActivationStateSuspended",
                     @"PKPaymentPassActivationStateDeactivated"];
    return (NSString *)[arr objectAtIndex:paymentPassActivationState];
}

-(NSDecimalNumber *_Nonnull)toDecimal:(NSObject *)amount {
  return [NSDecimalNumber decimalNumberWithString:[NSString stringWithFormat:@"%@", amount]];
}

@end
