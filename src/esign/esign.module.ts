import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EsignService } from './esign.service';
import { EsignController } from './esign.controller';

@Module({
  imports: [HttpModule],
  providers: [EsignService],
  controllers: [EsignController],
})
export class EsignModule {}

