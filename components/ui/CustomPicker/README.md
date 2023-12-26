# Custom Picker

> > ## About

This is a custom picker based initially on the library [react-native-picker-select](https://github.com/lawnstarter/react-native-picker-select).
</br>

The core class component was translated to a functional component and then split into smaller components to improve editability and facilitate the update of the modules.
</br>

The new components are the header, the input box and a picker component that contains both the iOS and Android versions of the wheel picker.
</br>

To the iOS version was added the new [Picker](https://github.com/react-native-picker/picker). The original module used the native picker that now is deprecated.
</br>

The Android version uses a special module called [react-native-wheel-picker-android](https://www.npmjs.com/package/react-native-wheel-picker-android), that replicates the wheel picker for this platform.
