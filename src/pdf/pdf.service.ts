// src/pdf/pdf.service.ts
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class PdfService {
  async createPdfWithTags(): Promise<string> {
    const doc = new PDFDocument();

    const filePath = path.join(__dirname, '../../pdfs', 'esign_document.pdf');
    await fs.ensureDir(path.dirname(filePath));

    // Create the PDF file
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add some content to the PDF
    doc.fontSize(25).text('eSign Document', 100, 100);

    // Add a radio button tag (example)
    doc.fontSize(12).text('Accept Terms and Conditions', 100, 150);
    doc.circle(90, 160, 10).stroke();
    
    // Add a signature field tag (example)
    doc.fontSize(12).text('Signature:', 100, 200);
    doc.rect(180, 195, 200, 30).stroke();

    // Finalize the PDF and end the stream
    doc.end();

    // Wait for the write stream to finish
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    return filePath;
  }
}

