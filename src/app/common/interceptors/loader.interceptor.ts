import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '@common/services/loader/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.toggleWaiting(true)

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle the error
        return throwError(error);
      }),
      finalize(() => {
        this.loaderService.toggleWaiting(false);
      })
    );
  }
}
