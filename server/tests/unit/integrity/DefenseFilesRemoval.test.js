const fs = require('fs');
const path = require('path');

describe('TDD RED: Complete Removal of Thesis Defense Specific Files', () => {
  const rootDir = path.resolve(__dirname, '../../../../');

  test('RED-DEFENSE-REMOVAL-01: docs/05-Code-Architecture-And-Defense-Guide.md must be permanently removed', () => {
    const defenseGuidePath = path.join(rootDir, 'docs', '05-Code-Architecture-And-Defense-Guide.md');
    expect(fs.existsSync(defenseGuidePath)).toBe(false);
  });

  test('RED-DEFENSE-REMOVAL-02: client/preview/defense-slides.html must be permanently removed', () => {
    const defenseSlidesPath = path.join(rootDir, 'client', 'preview', 'defense-slides.html');
    expect(fs.existsSync(defenseSlidesPath)).toBe(false);
  });

  test('RED-DEFENSE-REMOVAL-03: doc_mind/ directory must be completely eradicated', () => {
    const docMindDir = path.join(rootDir, 'doc_mind');
    expect(fs.existsSync(docMindDir)).toBe(false);
  });
});
