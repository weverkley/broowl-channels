import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpEventType
} from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private count: number;
  private isLoading: boolean;

  constructor(private router: Router) {
    this.count = 0;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.count++;

    if (this.count === 1) {
      this.presentLoading();
    }

    return next.handle(req).pipe(timeout(30000), tap((e: HttpEvent<any>) => {
      if (e.type === HttpEventType.UploadProgress) {
        // this.dialog.setLoadingMode('determinate');
        // this.dialog.setLoadingValue(Math.round(100 * e.loaded / e.total));
      } else if (e instanceof HttpResponse) {
        this.count--;
        if (this.count === 0) {
          this.closeLoading();
        }
      }
    }),
      catchError(e => {
        this.closeLoading();
        if (e instanceof HttpErrorResponse) {
          if (e.status === 401) {
            setTimeout(() => {
              localStorage.removeItem('token');
              this.router.navigateByUrl('/signin');
            }, 1000);
          } else if (e.status === 503) {
            this.presentAlert('Serviço temporáriamente indisponível');
          } else {
            if (e.error.message) {
              this.presentAlert(e.error.message);
            } else if (e.status === 0) {
              this.presentAlert(e.statusText);
            }
          }
        }
        return observableThrowError(e);
      }));
  }

  async presentLoading() {
    this.isLoading = true;
    // const loading = await this.loadingController.create();
    // return await loading.present().then(() => {
    //   if (!this.isLoading) {
    //     loading.dismiss();
    //   }
    // });
  }

  async closeLoading() {
    this.isLoading = false;
    // return await this.loadingController.dismiss();
  }

  async presentAlert(msg: string) {
    // const alert = await this.alertController.create({
    //   header: 'Algo deu errado ao processar sua requisição',
    //   // subHeader: 'Subtitle',
    //   message: msg,
    //   buttons: ['OK']
    // });

    // await alert.present();
  }

}
