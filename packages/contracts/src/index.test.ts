import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createHealthStatus, createServiceHealthResponse } from './index';

describe('createHealthStatus', () => {
  it('returns an ok health payload for a service', () => {
    const result = createHealthStatus('api');

    assert.equal(result.status, 'ok');
    assert.equal(result.service, 'api');
    assert.ok(typeof result.timestamp === 'string');
  });
});

describe('createServiceHealthResponse', () => {
  it('marks overall status ok when the database is up', () => {
    const result = createServiceHealthResponse('api', 'up');
    assert.equal(result.status, 'ok');
    assert.equal(result.checks.database.status, 'up');
  });

  it('marks overall status degraded when the database is down', () => {
    const result = createServiceHealthResponse('api', 'down');
    assert.equal(result.status, 'degraded');
    assert.equal(result.checks.database.status, 'down');
  });
});
