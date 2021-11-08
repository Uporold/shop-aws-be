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
import { PathInterceptor } from './path.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(CustomCacheInterceptor, PathInterceptor)
  @All(['/:recipient', '/:recipient/:id', '/:recipient/*'])
  async bff(@Req() req, @Param('recipient') recipient) {
    console.log('recipient', recipient);
    console.log('originalUrl', req.originalUrl);
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
