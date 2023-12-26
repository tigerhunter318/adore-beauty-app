package au.com.adorebeauty.shop;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;

import androidx.annotation.RequiresApi;

import com.emarsys.Emarsys;
import com.emarsys.config.EmarsysConfig;
import com.emarsys.rnwrapper.RNEmarsysEventHandler;
import com.emarsys.rnwrapper.RNEmarsysWrapperPackage;
import io.branch.rnbranch.RNBranchModule;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import au.com.adorebeauty.shop.newarchitecture.MainApplicationReactNativeHost;
import au.com.adorebeauty.shop.BuildConfig;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  private final ReactNativeHost mNewArchitectureNativeHost =
      new MainApplicationReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();

    EmarsysConfig config = new EmarsysConfig.Builder()
          .application(this)
          .applicationCode(BuildConfig.APP_RELEASE_TYPE.equals("production") ? "EMSC6-61228" : "EMSDA-4304F")
          .merchantId("114183C500EBA689")
          .build();

    createNotificationChannels();
    Emarsys.setup(config);

    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    RNBranchModule.getAutoInstance(this);
    // Has to come after SoLoader.init
    RNEmarsysEventHandler eventHandler = RNEmarsysEventHandler.getInstance();
    eventHandler.setEventHandlers();
  }

  private void createNotificationChannels() {
      if (Build.VERSION.SDK_INT >= 26) {
        if (BuildConfig.APP_RELEASE_TYPE.equals("production")) {
          createNotificationChannel("ems_loyalty_rewards", "Loyalty Rewards", "Loyalty Rewards messages go into this channel", NotificationManager.IMPORTANCE_HIGH);
          createNotificationChannel("ems_personalised_offers", "Personalised Offers", "Personalised Offers messages go into this channel", NotificationManager.IMPORTANCE_DEFAULT);
          createNotificationChannel("ems_customer_service", "Customer Service", "Customer Service messages go into this channel", NotificationManager.IMPORTANCE_DEFAULT);
          createNotificationChannel("ems_offers_promos", "Offers & Promotions", "Offers & Promotions messages go into this channel", NotificationManager.IMPORTANCE_LOW);
          createNotificationChannel("ems_wishlist", "Wishlist", "Wishlist messages go into this channel", NotificationManager.IMPORTANCE_LOW);
          createNotificationChannel("ems_recommended_products", "Recommended Products", "Recommended Products messages go into this channel", NotificationManager.IMPORTANCE_LOW);
          createNotificationChannel("ems_app_updates", "App updates", "App updates messages go into this channel", NotificationManager.IMPORTANCE_MIN);
        } else {
          createNotificationChannel("ems_staging_loyalty_rewards", "Loyalty Rewards", "Loyalty Rewards messages go into this channel", NotificationManager.IMPORTANCE_HIGH);
          createNotificationChannel("ems_staging_personalised_offers", "Personalised Offers", "Personalised Offers messages go into this channel", NotificationManager.IMPORTANCE_DEFAULT);
          createNotificationChannel("ems_staging_customer_service", "Customer Service", "Customer Service messages go into this channel", NotificationManager.IMPORTANCE_DEFAULT);
          createNotificationChannel("ems_staging_offers_promos", "Offers & Promotions", "Offers & Promotions messages go into this channel", NotificationManager.IMPORTANCE_LOW);
          createNotificationChannel("ems_staging_wishlist", "Wishlist", "Wishlist messages go into this channel", NotificationManager.IMPORTANCE_LOW);
          createNotificationChannel("ems_staging_recommended_products", "Recommended Products", "Recommended Products messages go into this channel", NotificationManager.IMPORTANCE_LOW);
          createNotificationChannel("ems_staging_app_updates", "App updates", "App updates messages go into this channel", NotificationManager.IMPORTANCE_MIN);
        }
      }
    }
  @RequiresApi(api = Build.VERSION_CODES.O)
    private void createNotificationChannel(String id, String name, String description, int importance) {
      NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
      NotificationChannel channel = new NotificationChannel(id, name, importance);
      channel.setDescription(description);
      notificationManager.createNotificationChannel(channel);
    }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("au.com.adorebeauty.shop.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
