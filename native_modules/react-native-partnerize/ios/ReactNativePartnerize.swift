// ReactNativePartnerize.swift

import Foundation
import PartnerizeSDK

@objc(ReactNativePartnerize)
public class ReactNativePartnerize : NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  public func isLoggingEnabled(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    resolve([
      "isLoggingEnabled": Partnerize.loggingEnabled
    ])
  }
  
  @objc
  public func startConversion(_ urlString : String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let url = URL(string: urlString);
    Partnerize.loggingEnabled = true
    if (Partnerize.isClickRequest(url:url!)) {
      Partnerize.handleInboundURL(url!, persistClickRef: false) { result in
        switch result {
          case .success(let click):
            resolve([
              "clickRef" : click.clickRef,
              "camRef" : click.camRef as Any,
              "destination" : click.destination,
              "utmParams" : click.utmParams,
              "meta" : click.meta,
            ])
          case .failure(let error):
            reject("handleInboundURLError", error.localizedDescription, error)
        }
      }
    }
  }

  
  @objc
  public func completeConversion(_ cartData: [String: Any], _ clickRef : String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let conversion = self.prepareConversion(cartData: cartData)
    Partnerize.completeConversion(conversion, clickRef:clickRef) { result in
      switch result {
      case .success(let conversionResult):
        resolve([
          "result" : String(describing: conversionResult),
          "success": true,
          "message": "Conversion Success"
        ])
      case .failure(let error):
        let code = String(describing: error)
        let message = error.localizedDescription
        reject(code, message, error)
      }
      
    }
  
    
  }

  private func prepareConversion(cartData: [String: Any]) -> Conversion {
    let conversionItems = (cartData["products"] as? [[String: AnyObject]] ?? []).compactMap {
      ConversionItem(
        value: $0["price"] as? Double ?? 0.0,
        category: $0["category"] as? String ?? "",
        quantity: $0["quantity"] as? Int,
        sku: $0["sku"] as? String,
        metadata: $0["metadata"] as? [String: String]
      )
    }
    var conversion = Conversion(
      conversionRef: cartData["conversionRef"] as? String ?? "",
      country: cartData["country"] as? String ?? "",
      currency: cartData["currency"] as? String ?? "",
      custRef: cartData["custRef"] as? String ?? "",
      customerType: (cartData["isReturningCustomer"] as? Bool ?? false) ? CustomerType.existing : CustomerType.new,
      items: conversionItems
    )
    
    let voucher = cartData["voucher"] as? String
    if (voucher != nil) {
      conversion.voucher = voucher
    }
    let metadata = cartData["metadata"] as? [String: String]
    if (metadata != nil) {
      conversion.metadata = metadata
    }
    return conversion
  }

}
