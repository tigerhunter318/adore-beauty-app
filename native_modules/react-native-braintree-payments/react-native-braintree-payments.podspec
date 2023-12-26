# react-native-braintree-payments.podspec

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-braintree-payments"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-braintree-payments
                   DESC
  s.homepage     = "https://github.com/fatlinesofcode/react-native-braintree-payments"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Phil Andrews" => "phil@frontside.com.au" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/fatlinesofcode/react-native-braintree-payments.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,cc,cpp,m,mm,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency    'Braintree'
#   s.dependency    'BraintreeDropIn'
  s.dependency    'Braintree/DataCollector'
  s.dependency    'Braintree/Apple-Pay'
  #s.dependency    'Braintree/Venmo'
  # ...
  # s.dependency "..."
end

