import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CatalogModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}
