import {
  CacheInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const recipient = req.params.recipient;
    console.log(req.params.recipient);
    const isCacheable =
      req.method === 'GET' &&
      process.env[`${recipient}_is_cacheable`] === 'true' &&
      !req.params.id;
    console.log(isCacheable);
    if (isCacheable) {
      return await super.intercept(context, next);
    }
    return next.handle();
  }
}
