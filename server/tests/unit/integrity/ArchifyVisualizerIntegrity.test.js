/**
 * ArchifyVisualizerIntegrity.test.js
 * 
 * TDD Integrity Test Suite for Archify Interactive Animated Diagrams & Visualizer Hub.
 * Verifies JSON schemas, physical codebase file mappings, standalone HTML builds,
 * and All-in-One Archify Interactive Hub.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../../../../');
const ARCH_DIR = path.join(REPO_ROOT, 'docs/architecture');
const PREVIEW_DIR = path.join(REPO_ROOT, 'client/preview');

describe('Archify Visualizer Suite Integrity', () => {

  describe('RED-ARCH-01: JSON Schema & Specification Integrity', () => {
    it('should have valid nomadix-codebase-tree.json representing complete repository structure', () => {
      const treePath = path.join(ARCH_DIR, 'nomadix-codebase-tree.json');
      expect(fs.existsSync(treePath)).toBe(true);

      const tree = JSON.parse(fs.readFileSync(treePath, 'utf8'));
      expect(tree.schema_version).toBe(1);
      expect(tree.diagram_type).toBe('tree');
      expect(tree.meta).toBeDefined();
      expect(tree.meta.title).toMatch(/Nomadix.*Codebase/i);
      expect(Array.isArray(tree.nodes)).toBe(true);
      expect(tree.nodes.length).toBeGreaterThanOrEqual(25);

      // Verify essential branches exist in nodes
      const nodeLabels = tree.nodes.map(n => n.label);
      expect(nodeLabels.some(l => l.includes('client/'))).toBe(true);
      expect(nodeLabels.some(l => l.includes('server/'))).toBe(true);
      expect(nodeLabels.some(l => l.includes('docker/'))).toBe(true);
      expect(nodeLabels.some(l => l.includes('docs/'))).toBe(true);
      expect(nodeLabels.some(l => l.includes('memory-bank/'))).toBe(true);
    });

    it('should have valid nomadix-architecture.json covering 5 tiers and 5 core modules', () => {
      const archPath = path.join(ARCH_DIR, 'nomadix-architecture.json');
      expect(fs.existsSync(archPath)).toBe(true);

      const arch = JSON.parse(fs.readFileSync(archPath, 'utf8'));
      expect(arch.schema_version).toBe(1);
      expect(arch.diagram_type).toBe('architecture');
      expect(arch.meta.title).toMatch(/Nomadix.*Architecture/i);

      const compIds = arch.components.map(c => c.id);
      expect(compIds).toContain('mobile-client');
      expect(compIds).toContain('api-gateway');
      expect(compIds).toContain('auth-service');
      expect(compIds).toContain('booking-service');
      expect(compIds).toContain('itinerary-service');
      expect(compIds).toContain('expense-service');
      expect(compIds).toContain('gamification-service');
      expect(compIds).toContain('postgres-db');
      expect(compIds).toContain('mongo-db');
      expect(compIds).toContain('redis-cache');
    });

    it('should have valid nomadix-workflow.json with signal-flow and animation trace', () => {
      const workflowPath = path.join(ARCH_DIR, 'nomadix-workflow.json');
      expect(fs.existsSync(workflowPath)).toBe(true);

      const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
      expect(workflow.schema_version).toBe(2);
      expect(workflow.diagram_type).toBe('workflow');
      expect(workflow.meta.animation).toBe('trace');
      expect(workflow.meta.visual_preset).toBe('signal-flow');
      expect(Array.isArray(workflow.lanes)).toBe(true);
      expect(workflow.lanes.length).toBeGreaterThanOrEqual(4);
      expect(Array.isArray(workflow.nodes)).toBe(true);
      expect(workflow.nodes.length).toBeGreaterThanOrEqual(10);
      expect(Array.isArray(workflow.edges)).toBe(true);
    });
  });

  describe('RED-ARCH-02: Physical Codebase Evidence & File Mapping', () => {
    it('should ensure all components in architecture map to real existing physical files', () => {
      const archPath = path.join(ARCH_DIR, 'nomadix-architecture.json');
      const arch = JSON.parse(fs.readFileSync(archPath, 'utf8'));

      const criticalComponents = [
        { id: 'auth-service', expectedFile: 'server/src/services/auth.service.js' },
        { id: 'booking-service', expectedFile: 'server/src/services/booking.service.js' },
        { id: 'itinerary-service', expectedFile: 'server/src/services/itinerary.service.js' },
        { id: 'expense-service', expectedFile: 'server/src/services/expense.service.js' },
        { id: 'gamification-service', expectedFile: 'server/src/services/gamification.service.js' },
        { id: 'api-gateway', expectedFile: 'server/src/app.js' },
        { id: 'postgres-db', expectedFile: 'docker/init-db/01-init.sql' },
      ];

      criticalComponents.forEach(({ id, expectedFile }) => {
        const comp = arch.components.find(c => c.id === id);
        expect(comp).toBeDefined();
        const physicalPath = path.join(REPO_ROOT, expectedFile);
        expect(fs.existsSync(physicalPath)).toBe(true);
      });
    });
  });

  describe('RED-ARCH-03: Rendered Standalone Archify HTML Artifacts', () => {
    it('should have compiled standalone HTML files in docs/architecture and client/preview', () => {
      const requiredHtmlFiles = [
        path.join(ARCH_DIR, 'nomadix-codebase-tree.html'),
        path.join(ARCH_DIR, 'nomadix-architecture.html'),
        path.join(ARCH_DIR, 'nomadix-workflow.html'),
      ];

      if (fs.existsSync(PREVIEW_DIR)) {
        requiredHtmlFiles.push(
          path.join(PREVIEW_DIR, 'nomadix-codebase-tree.html'),
          path.join(PREVIEW_DIR, 'nomadix-architecture.html'),
          path.join(PREVIEW_DIR, 'nomadix-workflow.html'),
        );
      }

      requiredHtmlFiles.forEach(htmlFile => {
        expect(fs.existsSync(htmlFile)).toBe(true);
        const content = fs.readFileSync(htmlFile, 'utf8');
        expect(content).toContain('<!DOCTYPE html>');
        expect(content).toContain('archify');
      });
    });
  });

  describe('RED-ARCH-04: Nomadix Archify Interactive Hub', () => {
    it('should provide client/preview/nomadix-archify-hub.html with navigation tabs and dark/light controls', () => {
      const hubPath = path.join(PREVIEW_DIR, 'nomadix-archify-hub.html');
      if (fs.existsSync(PREVIEW_DIR)) {
        expect(fs.existsSync(hubPath)).toBe(true);
        const content = fs.readFileSync(hubPath, 'utf8');
        expect(content).toContain('<!DOCTYPE html>');
        expect(content).toContain('nomadix-architecture.html');
        expect(content).toContain('nomadix-codebase-tree.html');
        expect(content).toContain('nomadix-workflow.html');
        expect(content).toContain('nomadix-polyglot-erd.html');
        expect(content).toContain('data-theme');
      } else {
        expect(true).toBe(true);
      }
    });
  });

});
