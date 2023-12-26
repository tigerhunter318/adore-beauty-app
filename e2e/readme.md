# Detox End-to-end tests
#Detox docs
https://github.com/wix/Detox/blob/master/docs/APIRef.Matchers.md
https://github.com/wix/Detox/blob/master/docs/APIRef.ActionsOnElement.md


### "--DETOX-BUILD--"
- detox build --configuration ios.sim.release

###  "--DETOX-TEST--"
- detox test --record-logs all --take-screenshots all --configuration ios.sim.release --cleanup --artifacts-location "./artifacts"
- detox test --take-screenshots all --configuration ios.sim.release --cleanup --artifacts-location "./artifacts"

### test a single suite
detox test --configuration ios.sim.debug --loglevel verbose e2e/000-screen/ShopScreen.e2e.js

