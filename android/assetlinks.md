#verify app links
- https://developer.android.com/training/app-links/verify-site-associations#web-assoc
- google play signing
  - https://play.google.com/console/u/0/developers/6148245179768749977/app/4976125303817397399/keymanagement?tab=appSigning
- auto verify script (https://developer.android.com/training/app-links/verify-site-associations#auto-verification)
- https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://www.adorebeauty.com.au&relation=delegate_permission/common.handle_all_urls
- https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://staging.adorebeauty.com.au&relation=delegate_permission/common.handle_all_urls
- https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://adorebeauty.prf.hn&relation=delegate_permission/common.handle_all_urls
- https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://adorebeauty.app.link&relation=delegate_permission/common.handle_all_urls
- verify assetlinks.json
  - https://developers.google.com/digital-asset-links/tools/generator
- apk analyzer
- https://www.sisik.eu/apk-tool
-

verify links on installed app via adb
```shell
./verifyAppLinks.sh
```
