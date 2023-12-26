#!/bin/bash
# extract sha1 and keyhash from apk/aab
for f in app/build/outputs/apk/release/*.apk app/build/outputs/bundle/release/*.aab;
do
  echo "-- sha1 and keyhash for $f"
  keytool -printcert -jarfile $f | grep "SHA1: " | cut -d " " -f 3
  keytool -printcert -jarfile $f | grep "SHA1: " | cut -d " " -f 3 | xxd -r -p | openssl base64
  echo "-- done"
  echo
done

# extract sha1 and keyhash from keystores
for f in app/*.keystore
do
  echo "-- sha1 and keyhash for $f"
  keytool -exportcert -alias androidreleasekey -storepass android -keystore $f | openssl sha1 -binary | openssl base64
  echo "-- done"
  echo
done
