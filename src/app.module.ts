import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfService } from './pdf/pdf.service';
import { PdfController } from './pdf/pdf.controller';
import { PdfModule } from './pdf/pdf.module';
import { EsignService } from './esign/esign.service';
import { EsignModule } from './esign/esign.module';
import { HttpModule } from '@nestjs/axios';
import { OAuthController } from './oauth/oauth.controller';
import { OAuthModule } from './oauth/oauth.module';

@Module({
  imports: [HttpModule, PdfModule, EsignModule, OAuthModule],
  controllers: [AppController, PdfController, OAuthController],
  providers: [AppService, PdfService, EsignService],
})
export class AppModule {}
