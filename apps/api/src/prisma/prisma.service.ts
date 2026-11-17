import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool | undefined;
  private client: PrismaClient | undefined;
  private connected = false;

  get prisma(): PrismaClient {
    if (!this.client) {
      throw new Error('PrismaClient is not initialized');
    }
    return this.client;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<boolean> {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      this.connected = false;
      this.logger.warn('DATABASE_URL is not set; database connectivity disabled');
      return false;
    }

    try {
      if (!this.client) {
        this.pool = new Pool({
          connectionString: databaseUrl,
          connectionTimeoutMillis: 5_000,
        });
        const adapter = new PrismaPg(this.pool);
        this.client = new PrismaClient({ adapter });
      }

      await this.client.$queryRaw`SELECT 1`;
      this.connected = true;
      this.logger.log('PostgreSQL connection established');
      return true;
    } catch (error) {
      this.connected = false;
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.error(`PostgreSQL connection failed: ${message}`);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.$disconnect();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(`Prisma disconnect warning: ${message}`);
    } finally {
      this.client = undefined;
    }

    try {
      if (this.pool) {
        await this.pool.end();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(`PostgreSQL pool shutdown warning: ${message}`);
    } finally {
      this.pool = undefined;
      this.connected = false;
    }
  }

  async checkDatabase(): Promise<boolean> {
    if (!this.client) {
      return this.connect();
    }

    try {
      await this.client.$queryRaw`SELECT 1`;
      this.connected = true;
      return true;
    } catch (error) {
      this.connected = false;
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(`Database health check failed: ${message}`);
      return false;
    }
  }
}
