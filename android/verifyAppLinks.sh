#!/bin/bash
echo "--reset links on installed app--"
adb shell pm set-app-links --package au.com.adorebeauty.shop 0 all
echo "--get links on installed app--"
adb shell pm get-app-links au.com.adorebeauty.shop
echo "--re-verify links on installed app--"
adb shell pm verify-app-links --re-verify au.com.adorebeauty.shop
echo "--get links on installed app (wait 5secs)--"
sleep 5 && adb shell pm get-app-links au.com.adorebeauty.shop
echo "--get user preferred links on installed app"
adb shell pm get-app-links --user cur au.com.adorebeauty.shop
echo "--verify url against installed app--"
adb shell am start -a android.intent.action.VIEW \
    -c android.intent.category.BROWSABLE \
    -d "https://www.adorebeauty.com.au"
