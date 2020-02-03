import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OauthService} from '../security/oauth.service';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class SecurityInterceptor implements HttpInterceptor {

  constructor(private oauthSv: OauthService,  private log: NGXLogger) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.oauthSv.getToken();
    this.log.debug('token', token);
    const request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        // userId: '1',
        TokenProvider: OauthService.PROVIDER_NAME
      }
    });
    this.log.debug('interceptor trigger');
    return next.handle(request);
  }

}
