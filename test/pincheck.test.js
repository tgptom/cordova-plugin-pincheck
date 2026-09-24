const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const repoRoot = path.resolve(__dirname, '..');

function readFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('JavaScript bridge calls Cordova exec with expected contract', () => {
  let call = null;
  const originalLoad = Module._load;

  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'cordova/exec') {
      return function exec(success, error, service, action, args) {
        call = { success, error, service, action, args };
      };
    }
    return originalLoad(request, parent, isMain);
  };

  try {
    const modulePath = path.join(repoRoot, 'www', 'PinCheck.js');
    delete require.cache[modulePath];
    const PinCheck = require(modulePath);
    const success = () => {};
    const error = () => {};

    PinCheck.isPinSetup(success, error);

    assert.deepEqual(call, {
      success,
      error,
      service: 'PinCheck',
      action: 'isPinSetup',
      args: ['arg0']
    });
  } finally {
    Module._load = originalLoad;
  }
});

test('package.json and plugin.xml stay synchronized and target expected metadata', () => {
  const pkg = JSON.parse(readFile('package.json'));
  const pluginXml = readFile('plugin.xml');

  assert.equal(pkg.name, 'cordova-plugin-pincheck');
  assert.equal(pkg.version, '0.0.7');
  assert.match(pkg.repository.url, /github\.com\/tgptom\/cordova-plugin-pincheck\.git$/);
  assert.equal(pkg.bugs.url, 'https://github.com/tgptom/cordova-plugin-pincheck/issues');
  assert.equal(pkg.homepage, 'https://github.com/tgptom/cordova-plugin-pincheck#readme');

  assert.match(pluginXml, /<plugin[^>]*id="cordova-plugin-pincheck"[^>]*version="0\.0\.7"/s);
  assert.match(pluginXml, /<repo>https:\/\/github\.com\/tgptom\/cordova-plugin-pincheck<\/repo>/);
  assert.match(pluginXml, /<engine name="cordova-android" version=">=10\.0\.0" \/>/);
  assert.match(pluginXml, /<engine name="cordova-ios" version=">=7\.0\.0" \/>/);
  assert.match(pluginXml, /<source-file src="src\/android\/PinCheck\.java"/);
  assert.match(pluginXml, /<source-file src="src\/ios\/PinCheck\.m" \/>/);
  assert.match(pluginXml, /<framework src="LocalAuthentication\.framework" weak="false" \/>/);
});

test('Native contracts include stable PIN result values and iOS passcode-not-set handling', () => {
  const ios = readFile('src/ios/PinCheck.m');
  const android = readFile('src/android/PinCheck.java');

  assert.match(ios, /NSError \*error = nil;/);
  assert.match(ios, /canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&error/);
  assert.match(ios, /messageAsString:@"PIN_SETUP"/);
  assert.match(ios, /error\.code == LAErrorPasscodeNotSet/);
  assert.match(ios, /messageAsString:@"NO_PIN_SETUP"/);

  assert.match(android, /callbackContext\.success\("PIN_SETUP"\);/);
  assert.match(android, /callbackContext\.error\("NO_PIN_SETUP"\);/);
});
