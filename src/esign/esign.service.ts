import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import * as fs from 'fs-extra';
import * as FormData from 'form-data';

@Injectable()
export class EsignService {
  private readonly apiUrl = 'https://sign.zoho.com/api/v1';
  private accessToken: string;

  constructor(private readonly httpService: HttpService) {}

  private async getHeaders() {
    return {
      Authorization: `Zoho-oauthtoken ${this.accessToken}`,
    };
  }

  async generateAccessToken(authorizationCode: string): Promise<string> {
    try {
      const response = await this.httpService.post('https://accounts.zoho.com/oauth/v2/token', null, {
        params: {
          code: authorizationCode,
          client_id: `1000.EG9M2X6H73JKWVVDSH351EEK337B7P`,
          client_secret: `ddf2c0f5cf8589acc70b71b4400dd376aade57bb79`,
          redirect_uri: `http://localhost:3000/oauth/callback`,
          grant_type: 'authorization_code',
        },
      }).toPromise();

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Error generating access token:', error.response ? error.response.data : error.message);
      throw new HttpException('Failed to generate access token', 500);
    }
  }

  async uploadPdf(filePath: string): Promise<string> {
    try {
      const file = await fs.readFile(filePath);
      const formData = new FormData();
      formData.append('file', file, 'esign_document.pdf');

      const response = await lastValueFrom(
        this.httpService.post(`${this.apiUrl}/templates/upload`, formData, {
          headers: {
            ...formData.getHeaders(),
            ...await this.getHeaders(),
          },
        }),
      );

      return response.data.document_id; 
    } catch (error) {
      console.error('Error uploading PDF:', error.response ? error.response.data : error.message);
      throw new HttpException('Failed to upload PDF', 500);
    }
  }

  async addEsignTags(documentId: string): Promise<void> {
    try {
      const payload = {
        actions: [
          {
            recipient_id: 1,
            action_type: 'SIGN',
            fields: [
              {
                field_type: 'SIGNATURE',
                x_coord: 100,
                y_coord: 100,
                page_number: 1,
                field_name: 'Signature',
              },
              {
                field_type: 'RADIO',
                x_coord: 100,
                y_coord: 150,
                page_number: 1,
                field_name: 'Accept Terms',
              },
            ],
          },
        ],
      };

      await lastValueFrom(
        this.httpService.post(`${this.apiUrl}/templates/${documentId}/actions`, payload, {
          headers: await this.getHeaders(),
        }),
      );
    } catch (error) {
      console.error('Error adding eSign tags:', error.response ? error.response.data : error.message);
      throw new HttpException('Failed to add eSign tags', 500);
    }
  }

  async getPdf(documentId: string): Promise<Buffer> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/templates/${documentId}/document`, {
        headers: await this.getHeaders(),
        responseType: 'arraybuffer',
      }),
    );
  
    return response.data;
  }

  async submitForEsign(documentId: string): Promise<any> {
    try {
      const response = await this.httpService.post(
        `${this.apiUrl}/documents/${documentId}/submit`,
        {},
        {
            headers: await this.getHeaders(),
        },
      ).toPromise();

      return response.data;
    } catch (error) {
      throw new HttpException('Failed to submit for eSign', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
