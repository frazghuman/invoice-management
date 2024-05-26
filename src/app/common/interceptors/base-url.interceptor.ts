import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverUrl } from 'src/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  // private baseUrl: string = '/api'; // Replace with your base URL
  private baseUrl: string = serverUrl; // Replace with your base URL

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isFileUploadRequest = request.url.includes('/file/upload');
    const hasBaseUrl = request.url.includes('https://');

    const modifiedRequest = request.clone({
      url: `${!hasBaseUrl ? this.baseUrl : ''}${request.url}`,
      setHeaders: isFileUploadRequest ? {} : {
        'Content-Type': 'application/json'
      }
    });

    return next.handle(modifiedRequest);
  }
}
