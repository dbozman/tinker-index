import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const queryRaw = vi.fn();
const disconnect = vi.fn();
const poolEnd = vi.fn();

vi.mock('../generated/prisma/client', () => ({
  PrismaClient: class {
    $queryRaw = queryRaw;
    $disconnect = disconnect;
  },
}));

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: class {
    constructor(_pool: unknown) {}
  },
}));

vi.mock('pg', () => ({
  Pool: class {
    end = poolEnd;
  },
}));

describe('PrismaService', () => {
  const originalUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.resetModules();
    queryRaw.mockReset();
    disconnect.mockReset();
    poolEnd.mockReset().mockResolvedValue(undefined);
    process.env.DATABASE_URL = 'postgresql://tinker:tinker@localhost:5432/tinker_index';
  });

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalUrl;
    }
  });

  it('connects successfully and reports connected', async () => {
    queryRaw.mockResolvedValue([{ '?column?': 1 }]);
    const { PrismaService } = await import('./prisma.service');
    const service = new PrismaService();

    const connected = await service.connect();

    expect(connected).toBe(true);
    expect(service.isConnected()).toBe(true);
    await service.disconnect();
  });

  it('handles connection failure without throwing', async () => {
    queryRaw.mockRejectedValue(new Error('ECONNREFUSED'));
    const { PrismaService } = await import('./prisma.service');
    const service = new PrismaService();

    const connected = await service.connect();

    expect(connected).toBe(false);
    expect(service.isConnected()).toBe(false);
  });

  it('reports disconnected when DATABASE_URL is missing', async () => {
    delete process.env.DATABASE_URL;
    const { PrismaService } = await import('./prisma.service');
    const service = new PrismaService();

    const connected = await service.connect();

    expect(connected).toBe(false);
    expect(service.isConnected()).toBe(false);
  });

  it('checkDatabase returns false after a query failure', async () => {
    queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]).mockRejectedValueOnce(new Error('down'));
    const { PrismaService } = await import('./prisma.service');
    const service = new PrismaService();

    await service.connect();
    const healthy = await service.checkDatabase();

    expect(healthy).toBe(false);
    expect(service.isConnected()).toBe(false);
    await service.disconnect();
  });
});
