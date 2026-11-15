const fs = require('fs');
const path = require('path');

describe('TDD RED: 5-Volume Software Engineering Curriculum Integrity', () => {
  const rootDir = path.resolve(__dirname, '../../../../');
  const curriculumDir = path.join(rootDir, 'docs', 'curriculum');

  const volumes = [
    'vol-01-engineering-mindset-and-architecture.md',
    'vol-02-polyglot-persistence-and-backend.md',
    'vol-03-core-algorithms-and-integrations.md',
    'vol-04-react-native-and-design-system.md',
    'vol-05-testing-devops-and-delivery.md',
  ];

  test('RED-CURRICULUM-01: docs/curriculum/README.md exists and contains syllabus overview', () => {
    const readmePath = path.join(curriculumDir, 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);
    const content = fs.readFileSync(readmePath, 'utf8');
    expect(content.length).toBeGreaterThan(1000);
    expect(content).toMatch(/Tập 1/i);
    expect(content).toMatch(/Tập 5/i);
  });

  test('RED-CURRICULUM-02: All 5 volume documentation files exist in docs/curriculum/', () => {
    for (const volFile of volumes) {
      const volPath = path.join(curriculumDir, volFile);
      expect(fs.existsSync(volPath)).toBe(true);
    }
  });

  test('RED-CURRICULUM-03: Each volume has deep, comprehensive instructional content (>= 3000 chars)', () => {
    for (const volFile of volumes) {
      const volPath = path.join(curriculumDir, volFile);
      expect(fs.existsSync(volPath)).toBe(true);
      const content = fs.readFileSync(volPath, 'utf8');
      expect(content.length).toBeGreaterThanOrEqual(3000);
      expect(content).toMatch(/```/); // Must have practical code snippets or diagrams
    }
  });
});
