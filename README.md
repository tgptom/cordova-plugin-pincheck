
# Pin Check/Passcode plugin for Apache Cordova

[![NPM](https://nodei.co/npm/cordova-plugin-pincheck.png)](https://nodei.co/npm/cordova-plugin-pincheck/)

## Introduction

This plugin is for use with [Apache Cordova](http://cordova.apache.org/) and allows your application to check whether pin/keyguard or passcode is setup on iOS and Android phones.

### Compatibility notes

- `cordova-android@14` and `cordova-android@15`: statically assessed as compatible.
- `cordova-ios@7` and `cordova-ios@8`: statically assessed as compatible.
- This is a source-level compatibility assessment. It is **not** a claim that runtime/device testing was performed for every platform combination.

> `cordova-ios` package versions are not the same as Apple iOS operating-system versions.
>  
> The plugin's iOS native code uses `LocalAuthentication` and returns:
> - success: `PIN_SETUP`
> - error: `NO_PIN_SETUP` when no passcode is configured

## Installation

Below are the methods for installing this plugin automatically using command line tools. For additional info, take a look at the [Plugman Documentation](https://cordova.apache.org/docs/en/latest/plugin_ref/plugman.html), [`cordova plugin` command](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-plugin-command) and [Cordova Plugin Specification](https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html).

### Cordova

The plugin can be installed via the Cordova command line interface:

* Navigate to the root folder for your phonegap project.
* Run the command:

```sh
cordova plugin add cordova-plugin-pincheck
```


## Plugin API

#### Detect whether pin is setup on device 

```js
if(window.cordova && window.cordova.plugins.PinCheck){
      window.cordova.plugins.PinCheck.isPinSetup(function(success){
        console.log("pin is setup.");
      }, function(fail){
        console.log("pin not setup.");
      });
    }
```

## Automated checks

Run repository checks with:

```sh
npm test
```

These checks validate:
- JavaScript bridge contract (`service`, `action`, and argument shape).
- `package.json` and `plugin.xml` metadata/version consistency.
- Static native contract strings and iOS `LAErrorPasscodeNotSet` handling branch.

## Manual device verification checklist

Because LocalAuthentication behavior is device/security-state dependent, complete manual verification on physical devices:

1. Android device with secure lock enabled (PIN/pattern/password) → expect success callback with `PIN_SETUP`.
2. Android device without secure lock → expect error callback with `NO_PIN_SETUP`.
3. iOS device with passcode enabled → expect success callback with `PIN_SETUP`.
4. iOS device without passcode enabled → expect error callback with `NO_PIN_SETUP`.

Optional additional iOS checks:
- Face ID/Touch ID enabled and disabled, while keeping passcode state controlled.

## LICENSE

    The MIT License

    Copyright (c) 2015 Crypho AS.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
