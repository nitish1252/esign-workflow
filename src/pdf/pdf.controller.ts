// src/pdf/pdf.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import * as path from 'path';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('generate')
  async generatePdf(@Res() res: Response) {
    try {
      const filePath = await this.pdfService.createPdfWithTags();
      res.download(filePath);
    } catch (error) {
      res.status(500).send('Failed to generate PDF');
    }
  }
}

