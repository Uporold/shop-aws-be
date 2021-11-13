import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from 'axios';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}
  async sendRequest(
    method: Method,
    recipientUrl: string,
    originalUrl: string,
    body: any,
  ) {
    const axiosConfig = {
      method,
      url: `${recipientUrl}${originalUrl}`,
      ...(Object.keys(body).length > 0 && { data: body }),
    };
    try {
      // return this.httpService
      //   .request(axiosConfig)
      //   .pipe(map((response) => response.data));
      return await this.httpService.axiosRef.request(axiosConfig);
    } catch (e) {
      if (e.response) {
        throw new HttpException(
          e.response.data.message || e.message,
          e.response.status,
        );
      }
      throw new InternalServerErrorException(e.message);
    }
  }
}
