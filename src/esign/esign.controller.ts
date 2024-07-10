// src/esign/esign.controller.ts
import { Controller, Post, Get, Query, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { EsignService } from './esign.service';
import { Response } from 'express';

@Controller('esign')
export class EsignController {
  constructor(private readonly esignService: EsignService) {}

  @Post('upload')
  async uploadPdf(@Body('filePath') filePath: string) {
    try {
      const documentId = await this.esignService.uploadPdf(filePath);
      return { documentId };
    } catch (error) {
      throw new HttpException('Failed to upload PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('add-tags')
  async addEsignTags(@Body('documentId') documentId: string) {
    try {
      await this.esignService.addEsignTags(documentId);
      return { message: 'eSign tags added successfully' };
    } catch (error) {
      throw new HttpException('Failed to add eSign tags', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('preview')
  async previewPdf(@Query('documentId') documentId: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.esignService.getPdf(documentId);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
    } catch (error) {
      throw new HttpException('Failed to retrieve PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('submit')
  async submitForEsign(
    @Body('documentId') documentId: string,
  ) {
    try {
      const result = await this.esignService.submitForEsign(documentId);
      return { message: 'Document submitted for eSign successfully', result };
    } catch (error) {
      throw new HttpException('Failed to submit for eSign', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

