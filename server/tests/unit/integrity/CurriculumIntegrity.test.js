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

  test('RED-WORKFLOW-01: docs/curriculum/master-project-workflow.md exists and has comprehensive depth (>= 5000 chars)', () => {
    const workflowPath = path.join(curriculumDir, 'master-project-workflow.md');
    expect(fs.existsSync(workflowPath)).toBe(true);
    const content = fs.readFileSync(workflowPath, 'utf8');
    expect(content.length).toBeGreaterThanOrEqual(5000);
  });

  test('RED-WORKFLOW-02: master-project-workflow.md covers all core business, engineering, and polyglot workflows with diagrams', () => {
    const workflowPath = path.join(curriculumDir, 'master-project-workflow.md');
    expect(fs.existsSync(workflowPath)).toBe(true);
    const content = fs.readFileSync(workflowPath, 'utf8');
    // Must contain sequence or flowchart diagrams
    expect(content).toMatch(/```mermaid/);
    // Must cover 6 core workflows
    expect(content).toMatch(/Engineering & Development Workflow/i);
    expect(content).toMatch(/Identity, Authentication & Session Lifecycle/i);
    expect(content).toMatch(/Smart Booking & Cache-Aside Pipeline/i);
    expect(content).toMatch(/Multi-City Planning & Map Route Discovery/i);
    expect(content).toMatch(/Squad Collaboration & Real-Time Sync/i);
    expect(content).toMatch(/Group Expense Splitting & Debt Settlement Pipeline/i);
    expect(content).toMatch(/Polyglot Cross-Database Consistency/i);
  });

  test('RED-WORKFLOW-03: docs/curriculum/README.md links to and features the Master Workflow blueprint', () => {
    const readmePath = path.join(curriculumDir, 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);
    const content = fs.readFileSync(readmePath, 'utf8');
    expect(content).toMatch(/master-project-workflow\.md/);
  });

  test('RED-PRESENTATION-01: docs/master-presentation-demo-script.md exists and has comprehensive depth (>= 3000 chars)', () => {
    const scriptPath = path.join(rootDir, 'docs', 'master-presentation-demo-script.md');
    expect(fs.existsSync(scriptPath)).toBe(true);
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content.length).toBeGreaterThanOrEqual(3000);
  });

  test('RED-PRESENTATION-02: Presentation script contains 5 phases, [Hành động] cues, and [Lời thoại] script', () => {
    const scriptPath = path.join(rootDir, 'docs', 'master-presentation-demo-script.md');
    expect(fs.existsSync(scriptPath)).toBe(true);
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toMatch(/PHẦN 1/i);
    expect(content).toMatch(/PHẦN 5/i);
    expect(content).toMatch(/\[Hành động\]/);
    expect(content).toMatch(/\[Lời thoại\]/);
    expect(content).toMatch(/Accordion Trip Wizard/i);
    expect(content).toMatch(/Greedy Minimum Cash-Flow/i);
  });
});
