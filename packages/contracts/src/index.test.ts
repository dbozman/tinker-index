import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createHealthStatus } from './index';

describe('createHealthStatus', () => {
  it('returns an ok health payload for a service', () => {
    const result = createHealthStatus('api');

    assert.equal(result.status, 'ok');
    assert.equal(result.service, 'api');
    assert.ok(typeof result.timestamp === 'string');
  });
});
