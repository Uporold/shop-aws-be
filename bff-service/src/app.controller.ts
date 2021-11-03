import {
  All,
  BadGatewayException,
  Controller,
  Param,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CustomCacheInterceptor } from './custom-cache.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(CustomCacheInterceptor)
  @All(['/:recipient', '/:recipient/:id'])
  async bff(@Req() req, @Param('recipient') recipient) {
    if (process.env[recipient]) {
      const { data } = await this.appService.sendRequest(
        req.method,
        process.env[recipient],
        req.originalUrl,
        req.body,
      );
      return data;
    }
    throw new BadGatewayException('Cannot process request');
  }
}
