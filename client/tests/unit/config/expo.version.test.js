const fs = require('fs');
const path = require('path');

describe('Unit Test: Expo SDK Version Specification', () => {
  test('RED-EXPO-SDK57-FULL-01: package.json must declare complete Expo SDK 57 stack (expo 57.x, react 19.x, react-native 0.86.x)', () => {
    const packageJsonPath = path.resolve(__dirname, '../../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    expect(packageJson.dependencies).toBeDefined();

    // 1. Expo must be SDK 57.x
    const expoVersion = packageJson.dependencies.expo;
    expect(/^[~^]?57\./.test(expoVersion)).toBe(true);

    // 2. React must be 19.x (expected by Expo 57)
    const reactVersion = packageJson.dependencies.react;
    expect(/^[~^]?19\./.test(reactVersion)).toBe(true);

    // 3. React Native must be 0.86.x (expected by Expo 57 native binary)
    const rnVersion = packageJson.dependencies['react-native'];
    expect(/^[~^]?0\.86\./.test(rnVersion)).toBe(true);
  });
});
