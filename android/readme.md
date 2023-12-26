`in ./app`

# build release
## aab
./gradlew ":app:bundleRelease"
## apk
./gradlew ":app:assembleRelease"

#key hashs
password android/app/build.gradle

keytool -exportcert -alias androidreleasekey -keystore debug.keystore | openssl sha1 -binary | openssl base64
keytool -exportcert -alias YOUR_RELEASE_KEY_ALIAS -keystore YOUR_RELEASE_KEY_PATH | openssl sha1 -binary | openssl base64

copy example.local.properties to local.properties and update path


##debug key
### generate keystore
keytool -genkey -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
keytool -genkey -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
## get hash from keystore
keytool -exportcert -alias androiddebugkey -storepass android -keystore android/app/debug.keystore | openssl sha1 -binary | openssl base64
## sha1
keytool -list -v -alias androiddebugkey -storepass android -keystore android/app/debug.keystore | grep "SHA1: " | cut -d " " -f 3

## temp release key
### generate keystore
keytool -genkey -v -keystore android/app/release.temp.keystore -storepass android -alias androidreleasekey -keypass android -keyalg RSA -keysize 2048 -validity 10000
### get hash from keystore
keytool -exportcert -alias androidreleasekey -storepass TbJg0SqrPFjU -keystore android/app/release.keystore | openssl sha1 -binary | openssl base64
### get hash from apk
keytool -printcert -jarfile app-release.apk | grep "SHA1: " | cut -d " " -f 3 | xxd -r -p | openssl base64

## bitrise
## signed
aab and apk signed in workflow with an uploaded keystore file

### get sha1 from apk
keytool -printcert -jarfile android/app/build/outputs/apk/release/app-release.apk | grep "SHA1: " | cut -d " " -f 3
### get hash from apk
keytool -printcert -jarfile android/app/build/outputs/apk/release/app-release.apk | grep "SHA1: " | cut -d " " -f 3 | xxd -r -pcd  | openssl base64
### script
use android/verify.sh


## google play console
https://play.google.com/console/u/0/developers/6148245179768749977/app-list

## enable internal app testing
https://stackoverflow.com/questions/57478894/how-to-enable-internal-app-sharing-for-android

#debug production build
- adb logcat
- error only
  -- adb logcat '*:E'

# clear build caches
./gradlew cleanBuildCache
./gradlew clean
rm -Rf ~/.gradle/caches android/.gradle android/app/build/
watchman watch-del-all
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache
watchman watch-del-all

