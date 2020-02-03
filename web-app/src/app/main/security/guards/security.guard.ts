import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs';
import {OauthService} from '../oauth.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityGuard implements CanActivate {

  constructor(private oauthSv: OauthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('SecurityGuard component getAuthUserAsync');
    return new Promise((resolve, reject) => {
      this.oauthSv.getAuthUserAsync().then( user => {
        console.log('authenticated');
        if (!user) {
          this.router.navigate(['login'], {queryParams: {reRouteUrl: state.url}});
        }
        resolve(true);
      })
        .catch( error => {
          // console.log(error);
          console.log('not authenticated, route to login');
          // this.router.navigateByUrl('login');
          this.router.navigate(['login'], {queryParams: {reRouteUrl: state.url}});
        });
    });
  }

}
