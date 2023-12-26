package au.com.adorebeauty.shop;

import android.os.Bundle; // here
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import org.devio.rn.splashscreen.SplashScreen; // here
import com.facebook.react.ReactRootView;
import au.com.adorebeauty.shop.BuildConfig;
import io.branch.rnbranch.*;
import android.content.Intent;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "AdoreBeauty";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);  // here
      super.onCreate(savedInstanceState);
  }

  // Override onStart, onNewIntent: for branch
  // https://help.branch.io/developers-hub/docs/react-native#android-2
  @Override
  protected void onStart() {
    super.onStart();
    RNBranchModule.initSession(getIntent().getData(), this);
    final Intent intent = getIntent();
  }

//   @Override
//   public void onNewIntent(Intent intent) {
//     super.onNewIntent(intent);
//     if (intent != null &&
//       intent.hasExtra("branch_force_new_session") &&
//       intent.getBooleanExtra("branch_force_new_session",false)) {
//       RNBranchModule.onNewIntent(intent);
//     }
//   }
  //https://github.com/BranchMetrics/react-native-branch-deep-linking-attribution/issues/707
  @Override
  public void onNewIntent(Intent intent) {
      super.onNewIntent(intent);
      RNBranchModule.onNewIntent(intent);
  }


  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
