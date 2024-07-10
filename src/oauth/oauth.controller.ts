// src/oauth/oauth.controller.ts

import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { EsignService } from '../esign/esign.service';

@Controller('oauth')
export class OAuthController {
    constructor(private readonly esignService: EsignService) {}

    @Get('callback')
        async handleCallback(@Query('code') code: string): Promise<string> {
            try {
                const accessToken = await this.esignService.generateAccessToken(code);
                return `Access token generated successfully: ${accessToken}`;
            } catch (error) {
                console.error('Error generating access token:', error);
                throw error;
            }
        }
  
}

