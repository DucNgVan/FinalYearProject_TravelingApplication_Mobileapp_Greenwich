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

  test('RED-CODE-EXPLAIN-04: docs/code_explain/02-redis-cache-aside-and-api-resilience.md exists with comprehensive depth (>= 3000 chars)', () => {
    const doc2File = path.join(codeExplainDir, '02-redis-cache-aside-and-api-resilience.md');
    expect(fs.existsSync(doc2File)).toBe(true);
    const content = fs.readFileSync(doc2File, 'utf8');
    expect(content.length).toBeGreaterThanOrEqual(3000);
  });

  test('RED-CODE-EXPLAIN-05: Document 02 contains Mermaid diagrams and key cache-aside / resilience terms', () => {
    const doc2File = path.join(codeExplainDir, '02-redis-cache-aside-and-api-resilience.md');
    expect(fs.existsSync(doc2File)).toBe(true);
    const content = fs.readFileSync(doc2File, 'utf8');
    expect(content).toMatch(/```mermaid[\s\S]*?flowchart/);
    expect(content).toMatch(/```mermaid[\s\S]*?sequenceDiagram/);
    expect(content).toMatch(/nomadix:flight:/);
    expect(content).toMatch(/duffel\.provider\.js/);
    expect(content).toMatch(/mock\.provider\.js/);
    expect(content).toMatch(/1800/);
  });

  test('RED-CODE-EXPLAIN-06: README.md links to Topic 02', () => {
    expect(fs.existsSync(readmeFile)).toBe(true);
    const readmeContent = fs.readFileSync(readmeFile, 'utf8');
    expect(readmeContent).toMatch(/02-redis-cache-aside-and-api-resilience\.md/);
  });
});
