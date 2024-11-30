import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

var pendingRequest = 0;

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Interceptor triggered");
    this.loadingService.showLoading();
    pendingRequest = pendingRequest + 1;

    return next.handle(req).pipe(
      tap({
        next:(event) => {
          if(event.type === HttpEventType.Response){
            this.handleHideLoading();
          }
        },
        error: (_) => {
          this.handleHideLoading();
        }
      })
    );
  }

  handleHideLoading(){
    pendingRequest = pendingRequest - 1;
    if(pendingRequest === 0)
      this.loadingService.hideLoading();
  }
}