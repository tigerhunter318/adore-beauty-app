// ReactNativePartnerizeModule.java
/*
 * android device logs
 * $ adb logcat | grep -E "ReactNativePartnerizeLog"
 */
package com.partnerize.reactnativepartnerize;

import android.content.Intent;
import android.net.Uri;
import android.content.Context;
import android.util.Log;
import android.widget.ArrayAdapter;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import com.facebook.react.bridge.WritableMap;
import com.partnerize.tracking.*;
import com.partnerize.tracking.Networking.IGetRequest;
import com.partnerize.tracking.Networking.RequestBuilder;
import com.partnerize.tracking.Networking.CompletableRequestWithResponse;

import java.util.HashMap;
import java.net.URL;

public class ReactNativePartnerizeModule extends ReactContextBaseJavaModule {
    private static Conversion conversion = null;
    private final ReactApplicationContext reactContext;

    public ReactNativePartnerizeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ReactNativePartnerize";
    }

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }

    @ReactMethod
    public void isLoggingEnabled(Promise promise) {
        try {
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("get logging enabled status error", e);
        }
    }

    @ReactMethod
    public void startConversion(String url, Promise promise) {
      Uri uri = Uri.parse(url);
      Partnerize partnerize = new Partnerize(reactContext.getApplicationContext());
      try {
        partnerize.beginConversion(uri, new CompletableClick() {
          @Override
          public void complete(Uri destination, String clickRef) {

            Log.d("ReactNativePartnerizeLog startConversion -->", clickRef);
            WritableMap result = Arguments.createMap();
            result.putString("clickRef", clickRef);
            result.putString("destination", destination.toString());
            promise.resolve(result);
          }

          @Override
          public void error(PartnerizeException exception) {
            promise.reject(exception);
          }
        });
      } catch (Exception e) {
        Log.d("ReactNativePartnerizeLog: uri in Exception --> ", uri.toString());
        Log.d("ReactNativePartnerizeLog: Exception --> ", e.toString());
        promise.reject(e);
      }

    }

    @ReactMethod
    public void completeConversion(ReadableMap cartData, String clickRef, Promise promise) {
      try {
        this.prepareConversion(cartData, clickRef);
        URL url = new URL(ReactNativePartnerizeModule.conversion.toString());
        RequestBuilder requestBuilder = new RequestBuilder();
        IGetRequest request = requestBuilder.buildGetRequest(url);
        Log.d("ReactNativePartnerizeLog conversion end url --> ", ReactNativePartnerizeModule.conversion.toString());
        request.send(new CompletableRequestWithResponse() {
          @Override
          public void complete(int status, String response) {
            if(status >= 200 && status < 300) {
              Log.d("ReactNativePartnerizeLog: response success -->", response);

              WritableMap result = Arguments.createMap();
              result.putString("response", response);
              result.putBoolean("success", true);
              result.putString("conversionUrl", ReactNativePartnerizeModule.conversion.toString());
              promise.resolve(result);

            } else {
              Log.d("ReactNativePartnerizeLog: response error -->", response);
              promise.reject("ReactNativePartnerizeLog posting conversion failed", response);
            }
          }

          @Override
          public void error(Exception ex) {
            Log.d("ReactNativePartnerizeLog: Request response -->", ex.toString());
            promise.reject("ReactNativePartnerizeLog posting conversion error", ex.toString());
          }
        });
      } catch (Exception e) {
        Log.d("ReactNativePartnerizeLog: conversion error -->", ".");
        Log.d("ReactNativePartnerizeLog: conversion error -->", e.toString());
        promise.reject("posting conversion to partnerize error", e.toString());
      }
    }

    private void prepareConversion(ReadableMap cartData, String clickRef) {
      ReadableArray products = cartData.getArray("products");
      ConversionItem[] conversionItems = new ConversionItem[products.size()];
      for (int i = 0; i < products.size(); i++) {
        ReadableMap product = products.getMap(i);
        Double price = 0.00;
        String category = null;
        Integer quantity = 0;
        String sku = null;
        HashMap metaData = null;
        if (product.hasKey("price")) {
          price = product.getDouble("price");
        }
        if (product.hasKey("category")) {
          category = product.getString("category");
        }

        ConversionItem.Builder conversionBuilderItem = new ConversionItem.Builder(String.valueOf(price), category);

        if (product.hasKey("quantity")) {
          quantity = product.getInt("quantity");
          conversionBuilderItem.setQuantity(quantity);
        }
        if (product.hasKey("sku")) {
          sku = product.getString("sku");
          conversionBuilderItem.setSku(sku);
        }
        if (product.hasKey("metadata")) {
          try {
            metaData = product.getMap("metadata").toHashMap();
            conversionBuilderItem.setMetadata(metaData);
          } catch (Exception e) {
            Log.d("ReactNativePartnerizeLog: Product Metadata Exception --> ", e.toString());
          }
        }
        conversionItems[i] = conversionBuilderItem.build();
      }


      ReactNativePartnerizeModule.conversion = new Conversion.Builder(clickRef).build();

      ReactNativePartnerizeModule.conversion = ReactNativePartnerizeModule.conversion.buildUpon().setConversionItems(conversionItems).build();

      if (cartData.hasKey("conversionRef")) {
        ReactNativePartnerizeModule.conversion = ReactNativePartnerizeModule.conversion.buildUpon().setConversionRef(cartData.getString("conversionRef")).build();
      }

      if (cartData.hasKey("currency")) {
        ReactNativePartnerizeModule.conversion = ReactNativePartnerizeModule.conversion.buildUpon().setCurrency(cartData.getString("currency")).build();
      }

      if (cartData.hasKey("country")) {
        ReactNativePartnerizeModule.conversion = ReactNativePartnerizeModule.conversion.buildUpon().setCountry(cartData.getString("country")).build();
      }

      if (cartData.hasKey("isReturningCustomer")) {
        ReactNativePartnerizeModule.conversion = ReactNativePartnerizeModule.conversion.buildUpon().setCustomerType(cartData.getBoolean("isReturningCustomer") ? CustomerType.EXISTING : CustomerType.NEW).build();
      }

      if (cartData.hasKey("voucher")) {
        ReactNativePartnerizeModule.conversion = ReactNativePartnerizeModule.conversion.buildUpon().setVoucher(cartData.getString("voucher")).build();
      }

      if (cartData.hasKey("custRef")) {
        ReactNativePartnerizeModule.conversion = ReactNativePartnerizeModule.conversion.buildUpon().setCustomerRef(cartData.getString("custRef")).build();
      }

      if (cartData.hasKey("metadata")) {
        try {
          HashMap cartMetaData = cartData.getMap("metadata").toHashMap();
          ReactNativePartnerizeModule.conversion = ReactNativePartnerizeModule.conversion.buildUpon().setMetadata(cartMetaData).build();
        } catch (Exception e) {
          Log.d("ReactNativePartnerizeLog: Cart Metadata Exception --> ", e.toString());
        }
      }
    }
}
