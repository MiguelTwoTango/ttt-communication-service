import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { Errors } from 'src/shared/errors';
// import { BusinessError } from '../errors/business-errors';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
     return next.handle()
       .pipe(catchError(error => {
         if (error.type === Errors.NOT_FOUND)
             throw new HttpException(error.message, HttpStatus.NOT_FOUND);
         else if (error.type === Errors.PRECONDITION_FAILED)
             throw new HttpException(error.message, HttpStatus.PRECONDITION_FAILED);
         else if (error.type === Errors.BAD_REQUEST)
             throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
         else
             throw error;
       }));
   }
}
