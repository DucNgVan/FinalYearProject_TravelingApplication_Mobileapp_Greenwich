const fs = require('fs');
const path = require('path');

describe('Unit Test: Expo SDK Version Specification', () => {
  test('RED-EXPO-SDK58-FULL-01: package.json must declare complete Expo SDK 58 stack (expo 58.x, react 19.3.x, react-native 0.88.x, babel-preset-expo 58.x)', () => {
    const packageJsonPath = path.resolve(__dirname, '../../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    expect(packageJson.dependencies).toBeDefined();

    // 1. Expo must be SDK 58.x
    const expoVersion = packageJson.dependencies.expo;
    expect(/^[~^]?58\./.test(expoVersion)).toBe(true);

    // 2. React must be 19.3.x (expected by Expo 58)
    const reactVersion = packageJson.dependencies.react;
    expect(/^[~^]?19\.3\./.test(reactVersion)).toBe(true);

    // 3. React Native must be 0.88.x (expected by Expo 58 native binary)
    const rnVersion = packageJson.dependencies['react-native'];
    expect(/^[~^]?0\.88\./.test(rnVersion)).toBe(true);

    // 4. Babel preset expo must be 58.x
    const babelPresetExpo = packageJson.devDependencies['babel-preset-expo'];
    expect(/^[~^]?58\./.test(babelPresetExpo)).toBe(true);
  });
});
