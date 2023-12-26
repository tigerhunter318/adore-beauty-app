# Adore Beauty Native App
- https://adorebeautywiki.atlassian.net/wiki/spaces/IT/pages/2065825800/Mobile+App

## Clone using Sourcetree (Recommended)
- https://confluence.atlassian.com/get-started-with-sourcetree/connect-your-bitbucket-or-github-account-847359096.html

## Recommended Dev Stack requirements
- Node.js: v16 lts - (https://nodejs.org/en/)
- Yarn: v1
- Xcode 14.2 - (https://developer.apple.com/xcode/resources/)
- Cocopods 1.12 - (https://cocoapods.org/)
- `sudo gem install cocoapods -v 1.12`
- Bitrise stack (https://github.com/bitrise-io/bitrise.io/blob/master/system_reports/MACOS/M1/osx-xcode-14.2.x-ventura.log)

## Recommended Dev Apps
- Sourcetree - (https://www.sourcetreeapp.com/)
- VsCode IDE or Webstorm IDE - (https://code.visualstudio.com/download) (https://www.jetbrains.com/webstorm/)

## App Stack
- React Native 68.2
- React 17.1 (with hooks)
- Apollo GraphQL
- Redux with promise middleware for using json Api

## dev setup (for local ios)
- `cp config/example-config.local.json config/config.local.json`
- `yarn`
- `yarn pods` or `npx pod-install`
- `yarn ios`

## android
- install Android Studio
- `cd android`
- `cp example.local.properties local.properties`
- edit sdk.dir to android local android sdk path
- `react-native run-android` to start emulator dev
- Debug using `Hermes debugger` in Flipper app

### android emulators
- local `.zshrc` settings
  ```
  export ANDROID_SDK=$HOME/Library/Android/sdk
  export PATH=$ANDROID_SDK/emulator:$ANDROID_SDK/tools:$PATH:$ANDROID_SDK/platform-tools:$PATH
  ```
- create 360px viewport emulator
  - https://developer.samsung.com/galaxy-emulator-skin/guide.html
  - Galaxy S8, 5.8 inches, 1440 x 2960 pixels
  - Android 10
  - Avd name : `Galaxy S8 API 29`


## git process for feature branching
- https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud
- https://www.atlassian.com/git/tutorials/learn-about-code-review-in-bitbucket-cloud
---
- create feature branches off **production** (Create Branch shortcut link in Jira ticket can be used )
- new branch name should use this naming format: MOB-{JiraID}-{name-of-feature}
- commit changes to this branch and push to remote repo
- once work is complete, create a pull-request (within Bitbucket) to production and move Jira ticket to **“peer review”**
- once pull-request is approved, merge git feature branch to **staging** branch
- move to Jira ticket to **“on staging”** when you see build Bitrise iOS build complete notification in Slack
- if changes are requested from peer-review or staging, move ticket back to **“in-progress”**
- once changes are complete move ticket to **“peer-review”** again, once re-approved merge to **staging** branch
- once feature is tested and approved, the jira ticket will be moved to **'ready to merge'** by a tester
- feature will be then be merged to **production** branch by repository admin
-
## deployment
- pushes to **staging** are deployed to TestFlight App via Bitrise workflow
- ios version (MARKETING_VERSION/CURRENT_PROJECT_VERSION) is set in Xcode archive set

## process for production app release deployment
- create a branch off production named 'release/v1.x.x'
- production build workflow will be started in bitrise for version 1.x.x

## git process for release bugfix
- create feature branches off **last** live release e.g. **release/v1.8.0**
- create a pull-request (within Bitbucket) to **release/v1.8.0** and move Jira ticket to **“peer review”**
- when approved for deployment, create **release/v1.8.1** git branch off feature for v1.8.1 app deployment


## debugging
### Install Flipper
 - https://fbflipper.com/docs/extending/debugging/#built-in-developer-tools
 - https://fbflipper.com/docs/features/react-native/
 - use Hermes debugger plugin

### react-devtools v4
- https://reactnative.dev/docs/debugging#react-developer-tools
- $ yarn add -g react-devtools

### react native
https://facebook.github.io/react-native/docs/text

### react navigation
https://reactnavigation.org/docs/en/headers.html#docsNav

### facebook
- ios appId ios/AdoreBeauty/Info.plist
- android appId android/app/src/main/res/values/strings.xml
- Settings url https://developers.facebook.com/apps/1469392956707347/dashboard/
- Events url https://www.facebook.com/events_manager2/list/app/1469392956707347/overview?act=159715027533878
- generate Android key hash `/android/app/keytool -exportcert -alias androiddebugkey -keystore debug.keystore | openssl sha1 -binary | openssl base64`
- android debug keyboard config and password `android/app/build.gradle`

### firebase
- https://console.firebase.google.com/project/adore-beauty-live-6837

#### Crashlytics dsyms
- download from TestFlight meta page using Safari and save to downloads folder https://appstoreconnect.apple.com/apps/1516572250/testflight/ios/f195bff7-20ab-4aac-8c2f-f1141a47fff5/metadata
- run `yarn upload-dsyms` to upload to Firebase

## Linting and code-formatting
- Whenever a commit is made, the new code will be run through Eslint.
- Eslint re-formatted the code according to a standard and also checks for syntax errors.
- If there are errors in the code the commit will be bailed.
- Additional IDE auto-formatting plugins such as Prettier should *not* be used

## Automated Testing

### jest
- jest unit tests can be added and will be run on git commit for changed files
- jest tests also on pull-requests via bitbucket pipelines
- manual run via `jest`
  - run and update snapshots `jest -u`
- watch one test `jest --watch components/cart/utils/__tests__/getCartTotals-test.js`

### e2e
- https://github.com/wix/Detox
  - `yarn add -g detox-cli`
- Build test
  - `detox build --configuration ios.sim.debug`
- Run test build
  - `detox test --configuration ios.sim.debug --loglevel verbose`

## remote logs
- sentry
  - https://sentry.io/organizations/adore-beauty/issues/?project=5276248&query=os.name%3AiOS&statsPeriod=14d
- crashlytics
  - https://console.firebase.google.com/project/adore-beauty-staging/crashlytics/app/ios:au.com.adorebeauty.shop/issues?state=all&time=last-seven-days&tag=all
- configure sourcemaps
  - `npx @sentry/wizard@1.4 -i reactNative -p ios android --skip-connect --quiet`

## clearing dev cache
```
yarn clear-cache
yarn reset-cache
rm -Rf ~/Library/Developer/Xcode/DerivedData/*
```

## updating packages
- `yarn upgrade-interactive`
