const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Unit Test: Client tsconfig.json Validation', () => {
  const tsconfigPath = path.resolve(__dirname, '../../../tsconfig.json');
  const clientDir = path.resolve(__dirname, '../../../');

  test('RED-TSCONFIG-01: tsconfig.json must specify moduleResolution as "bundler" for Expo SDK 57', () => {
    const rawContent = fs.readFileSync(tsconfigPath, 'utf8');
    const config = JSON.parse(rawContent);

    expect(config.compilerOptions).toBeDefined();
    expect(config.compilerOptions.moduleResolution).toBe('bundler');
    expect(config.compilerOptions.moduleResolution).not.toBe('node');
  });

  test('RED-TSCONFIG-02: tsc --noEmit must run with 0 errors and no TS5108 deprecation', () => {
    let output = '';
    let exitCode = 0;
    try {
      output = execSync('npx tsc --noEmit', { cwd: clientDir, encoding: 'utf8' });
    } catch (err) {
      exitCode = err.status || 1;
      output = err.stdout || err.stderr || err.message;
    }

    expect(exitCode).toBe(0);
    expect(output).not.toContain('TS5108');
    expect(output).not.toContain('customConditions');
  });
});
