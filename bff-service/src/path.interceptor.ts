import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PathInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const recipient = req.params.recipient;

    if (recipient === 'cart') {
      req.originalUrl = req.originalUrl.replace(`/${recipient}`, '');
    }

    return next.handle();
  }
}
