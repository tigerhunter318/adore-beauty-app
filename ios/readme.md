#xcode build
open AdoreBeauty.xcworkspace in xcode
product/archive

##certs
https://developer.apple.com/account/resources/certificates/list

#certs

#profiles
https://developer.apple.com/account/resources/profiles/list

#bitrise codesign
1. Xcode: profile / manage certs / + add distribution cert
2. Provisiong Profiles (https://developer.apple.com/account/resources/profiles/list) create new app-store profile
   1. download profile
3. run code codesigndoc
   1. https://devcenter.bitrise.io/code-signing/ios-code-signing/collecting-files-with-codesigndoc/
   2. `bash -l -c "$(curl -sfL https://raw.githubusercontent.com/bitrise-io/codesigndoc/master/_scripts/install_wrap-xcode.sh)"`

#bitrise builds
https://app.bitrise.io/dashboard/builds

#bitrise tokens
https://app.bitrise.io/me/profile#/security

## pod update to latest
pod install --repo-update

#clear cache
rm -Rf ~/Library/Developer/Xcode/DerivedData $TMPDIR/metro-cache $TMPDIR/haste-map-*
rm -Rf node_modules ios/Pods ~/Library/Developer/Xcode/DerivedData $TMPDIR/metro-cache $TMPDIR/haste-map-*
