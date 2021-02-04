import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorResponse } from '@core/http-interceptor/error-response';
import { ApiErrorEnum } from '@core/http-interceptor/api-error.enum';
import { ToastService } from 'ng-uikit-pro-standard';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private toastService: ToastService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('https://restcountries.eu/rest/v2/all')) {
      request = request.clone({
        withCredentials: true,
      });
    }

    return next.handle(request).pipe(
      catchError((httpError: HttpErrorResponse) => {
        const typeError: ApiErrorEnum = this.getTypeError(httpError);

        if (typeError === ApiErrorEnum.validation) {
          const validationError = httpError.error.error;

          if (this.showError(validationError)) {
            this.showErrorMessage(validationError.message, 'Validation error');
          } else {
            this.showErrorMessage('An internal server error has occurred');
          }

          if (validationError.status === 400 && validationError.code === 'NAUTH') {
            this.router.navigateByUrl('/');
          }
        } else if (typeError === ApiErrorEnum.params) {
          const message = httpError.error[Object.keys(httpError.error)?.shift()]?.msg;
          this.showErrorMessage(message, 'Fields validation');
        } else if (typeError === ApiErrorEnum.serverDown) {
          this.showErrorMessage('API is not available!');
        }
        return throwError(httpError);
      })
    );
  }

  showErrorMessage(msg: string, title = 'Error'): void {
    this.toastService.error(msg, title);
  }

  private getTypeError(httpError: HttpErrorResponse): ApiErrorEnum {
    if (httpError.status === 0) {
      return ApiErrorEnum.serverDown;
    }
    if (httpError.error.error) {
      return ApiErrorEnum.validation;
    }

    return ApiErrorEnum.params;
  }

  private showError(error: ErrorResponse): boolean {
    return error.status === 400 || error.isOperational;
  }
}
