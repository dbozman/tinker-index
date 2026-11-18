import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient, PublicationStatus } from '../src/generated/prisma/client';

const execFileAsync = promisify(execFile);
const runIntegration = Boolean(process.env.DATABASE_URL) && process.env.SKIP_DB_INTEGRATION !== '1';

describe.runIf(runIntegration)('Seed idempotency', () => {
  let pool: Pool;
  let prisma: PrismaClient;

  beforeAll(() => {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5_000,
    });
    prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  it('can run the seed script twice without duplicating demo projects', async () => {
    await execFileAsync('pnpm', ['exec', 'tsx', 'prisma/seed.ts'], {
      cwd: process.cwd(),
      env: process.env,
    });
    const firstCount = await prisma.project.count({
      where: { isDemo: true, status: PublicationStatus.PUBLISHED },
    });

    await execFileAsync('pnpm', ['exec', 'tsx', 'prisma/seed.ts'], {
      cwd: process.cwd(),
      env: process.env,
    });
    const secondCount = await prisma.project.count({
      where: { isDemo: true, status: PublicationStatus.PUBLISHED },
    });

    expect(firstCount).toBeGreaterThanOrEqual(12);
    expect(secondCount).toBe(firstCount);
  });
});
