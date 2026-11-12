import { Platform } from 'react-native';
import { resolveApiBaseUrl } from '../../../src/api/client';

describe('Unit Test: Dynamic API Base URL Resolution', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Platform.OS = originalPlatform;
  });

  test('RED-FE-URL-01: should prioritize custom production/staging URL when provided', () => {
    const customUrl = 'https://api.nomadix.vn/api/v1';
    const resolvedUrl = resolveApiBaseUrl(customUrl, null);
    expect(resolvedUrl).toBe('https://api.nomadix.vn/api/v1');
  });

  test('RED-FE-URL-02: should dynamically resolve host IP from Metro scriptURL across any Wi-Fi network', () => {
    const metroScriptURL = 'http://192.168.1.88:8081/index.bundle?platform=android&dev=true';
    const resolvedUrl = resolveApiBaseUrl(null, metroScriptURL);
    expect(resolvedUrl).toBe('http://192.168.1.88:5001/api/v1');
  });

  test('RED-FE-URL-03: should fallback to active Mac IP http://192.168.1.106:5001/api/v1 by default', () => {
    const resolvedUrl = resolveApiBaseUrl(null, null);
    expect(resolvedUrl).toBe('http://192.168.1.106:5001/api/v1');
  });

  test('RED-FE-URL-04: should accept LAN IP from environment http://192.168.1.106:5001/api/v1 without filtering it out', () => {
    const envUrl = 'http://192.168.1.106:5001/api/v1';
    const resolvedUrl = resolveApiBaseUrl(envUrl, null);
    expect(resolvedUrl).toBe('http://192.168.1.106:5001/api/v1');
  });

  test('RED-FE-URL-05: should keep localhost on iOS simulator instead of rewriting to 10.0.2.2', () => {
    Platform.OS = 'ios';
    const metroScriptURL = 'http://localhost:8081/index.bundle?platform=ios&dev=true';
    const resolvedUrl = resolveApiBaseUrl(null, metroScriptURL);
    expect(resolvedUrl).toBe('http://localhost:5001/api/v1');
  });

  test('RED-FE-URL-06: should rewrite localhost to 10.0.2.2 on Android emulator', () => {
    Platform.OS = 'android';
    const metroScriptURL = 'http://localhost:8081/index.bundle?platform=android&dev=true';
    const resolvedUrl = resolveApiBaseUrl(null, metroScriptURL);
    expect(resolvedUrl).toBe('http://10.0.2.2:5001/api/v1');
  });

  test('RED-FE-URL-07: should dynamically resolve newly switched Wi-Fi LAN IP (172.15.144.50) without hardcoding', () => {
    const metroScriptURL = 'http://172.15.144.50:8081/index.bundle?platform=ios&dev=true';
    const resolvedUrl = resolveApiBaseUrl(null, metroScriptURL);
    expect(resolvedUrl).toBe('http://172.15.144.50:5001/api/v1');
  });

  test('RED-FE-URL-08: should support and prioritize HTTP and HTTPS tunnel URLs without modification', () => {
    const httpsTunnel = 'https://nomadix-dev.loca.lt/api/v1';
    expect(resolveApiBaseUrl(httpsTunnel, null)).toBe('https://nomadix-dev.loca.lt/api/v1');

    const httpTunnel = 'http://nomadix-dev.ngrok-free.app/api/v1';
    expect(resolveApiBaseUrl(httpTunnel, null)).toBe('http://nomadix-dev.ngrok-free.app/api/v1');
  });
});

