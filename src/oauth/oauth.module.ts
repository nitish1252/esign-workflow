// src/app.module.ts

import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { HttpModule } from '@nestjs/axios';
import { EsignService } from 'src/esign/esign.service';

@Module({
  imports: [HttpModule],
  controllers: [OAuthController],
  providers: [EsignService],
})
export class OAuthModule {}

