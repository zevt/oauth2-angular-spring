import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {OauthService} from '../oauth.service';
import {Injectable} from '@angular/core';
import {AuthUser} from '../oauth/auth-user';

@Injectable({
  providedIn: 'root'
})
export class SecurityResolver implements Resolve<AuthUser> {


  constructor(private oauthSv: OauthService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AuthUser> | Promise<AuthUser> | AuthUser {

    return new Promise(( resolve, reject) => {
      console.log('Security Resolver: getAuthUserAsync');
      this.oauthSv.getAuthUserAsync().then(user => resolve(user))
        .catch(error => {
          this.router.navigate(['login']);
        });
    });



    // return this.oauthSv.getAuthUserAsync().then( user => Promise.resolve(user))
    //   .catch( error => {
    //     this.router.navigate('/login');
    //   });


  }






}
