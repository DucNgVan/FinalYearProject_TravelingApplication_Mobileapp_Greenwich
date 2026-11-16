const fs = require('fs');
const path = require('path');

describe('TDD RED: Code Explain Documentation Integrity', () => {
  const rootDir = path.resolve(__dirname, '../../../../');
  const codeExplainDir = path.join(rootDir, 'docs', 'code_explain');
  const docFile = path.join(codeExplainDir, '01-auth-middleware-and-acid-transactions.md');
  const readmeFile = path.join(codeExplainDir, 'README.md');

  test('RED-CODE-EXPLAIN-01: docs/code_explain/ and 01-auth-middleware-and-acid-transactions.md exist with comprehensive depth (>= 3000 chars)', () => {
    expect(fs.existsSync(codeExplainDir)).toBe(true);
    expect(fs.existsSync(docFile)).toBe(true);
    const content = fs.readFileSync(docFile, 'utf8');
    expect(content.length).toBeGreaterThanOrEqual(3000);
  });

  test('RED-CODE-EXPLAIN-02: Document contains both Mermaid sequence and flowchart diagrams', () => {
    expect(fs.existsSync(docFile)).toBe(true);
    const content = fs.readFileSync(docFile, 'utf8');
    expect(content).toMatch(/```mermaid[\s\S]*?flowchart/);
    expect(content).toMatch(/```mermaid[\s\S]*?sequenceDiagram/);
  });

  test('RED-CODE-EXPLAIN-03: Document maps exact source file paths and README index exists', () => {
    expect(fs.existsSync(readmeFile)).toBe(true);
    const content = fs.readFileSync(docFile, 'utf8');
    expect(content).toMatch(/auth\.middleware\.js/);
    expect(content).toMatch(/expense\.repository\.js/);
    expect(content).toMatch(/database\.js/);
    expect(content).toMatch(/client\.release\(\)/);
  });
});
