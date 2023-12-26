# react-native-partnerize.podspec

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-partnerize"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-partnerize
                   DESC
  s.homepage     = "https://github.com/github_account/react-native-partnerize"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Your Name" => "yourname@email.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/github_account/react-native-partnerize.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,cc,cpp,m,mm,swift}"
  s.header_dir   = 'ReactNativePartnerize' # also sets generated module name
  s.requires_arc = true
  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64'
  }
  s.user_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }
  s.script_phases = [
    # copy *-Swift.h generated headers to ios/Pods/Headers/Public/ReactNativePartnerize/
    { :name => 'Copy Swift Headers', :script => 'ditto "${DERIVED_SOURCES_DIR}/${PRODUCT_MODULE_NAME}-Swift.h" "${PODS_ROOT}/Headers/Public/${PRODUCT_MODULE_NAME}/${PRODUCT_MODULE_NAME}-Swift.h"' }
  ]

  s.dependency "React"
  s.dependency "Partnerize"
end

