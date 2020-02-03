/// <reference types="@types/facebook-js-sdk" />
// Above reference only works in Angular 6+
import {Injectable} from '@angular/core';
import {OauthProvider} from '../oauth/oauth-provider';
import {IAuthResponse} from '../oauth/iauth-response';
import {AuthUser} from '../oauth/auth-user';
import {environment} from '../../../../environments/environment';
import StatusResponse = facebook.StatusResponse;
import AuthResponse = facebook.AuthResponse;
import {NGXLogger} from 'ngx-logger';


@Injectable({
  providedIn: 'root'
})
export class FacebookService implements OauthProvider {

  appId = environment.facebookAppId;
  authResponse: AuthResponse;
  // expiresIn = 6000;
  expiresAt = 0;
  constructor(private log: NGXLogger) {

    this.init().then(token => {
      console.log('Facebook token: ' + token);
    });
  }

  private init(): Promise<string> {
    return new Promise((resolve, reject) => {

      FB.init({
        appId            : this.appId,
        autoLogAppEvents : true,
        xfbml            : true,
        cookie           : true,
        version          : 'v5.0'
      });

    });
  }

  isAuthenticated(): boolean {
    return false;
  }

  getAuthResponse(): IAuthResponse {
    return undefined;
  }

  signIn(): Promise<AuthUser> {
    console.log('Facebook login');

    return new Promise( (resolve, reject) => {
      FB.login((statusResponse: StatusResponse) => {
        if (statusResponse.status === 'connected' && statusResponse.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          this.log.debug('authResponse', statusResponse.authResponse);
          this.update(statusResponse.authResponse);
          const authUser = new AuthUser('facebook', '', '', '');
          resolve(authUser);
        } else {
          console.log('User cancelled login or did not fully authorize.');
          this.update(null);
          reject(null);
        }
      }, {scope: 'public_profile,email,user_location,user_hometown,user_age_range'});
    });
  }

  private update(authResponse): void {

    this.authResponse = authResponse;
    if (authResponse != null) {
      // this.expiresIn = authResponse.expiresIn * 1000;
      const expiresIn = (authResponse.expiresIn - 30) * 1000;
      // const expiresIn = 5 * 1000;
      // this.expiresAt = Date.now() + this.expiresIn;
      console.log('expiresAt', this.expiresAt);
      setTimeout(() => {
        this.refreshAuthResponse().then( x => x);
      }, expiresIn);
      // setTimeout(() => {
      //   console.log('try to refresh token');
      // }, expiresIn);
    }

  }

  private refreshAuthResponse(): Promise<AuthResponse>  {
    this.log.debug('Refreshing new AuthResponse');
    return new Promise<AuthResponse>((resolve, reject) => {
      FB.getLoginStatus((response: StatusResponse) => {
        if (response.status === 'connected') {
          // The user is logged in and has authenticated your
          // app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed
          // request, and the time the access token
          // and signed request each expire.
          this.log.debug('authResponse', response.authResponse);
          this.update(response.authResponse);
          console.log('Facebook User already login');
          console.log('Facebook access token: ', response.authResponse.accessToken);
          resolve(response.authResponse);

        } else if (response.status === 'not_authorized') {
          // The user hasn't authorized your application.  They
          // must click the Login button, or you must call FB.login
          // in response to a user gesture, to launch a login dialog.
          this.update(null);
          reject(null);
        } else {
          // The user isn't logged in to Facebook. You can launch a
          // login dialog with a user gesture, but the user may have
          // to log in to Facebook before authorizing your application.
          console.log('Facebook User did not login');
          this.update(null);
          reject(null);
        }
      }, true);
    });
  }

  private getLoginStatus(): Promise<AuthResponse> {
    if (this.authResponse) {
      this.log.debug('Reuse existing AuthResponse');
      this.update(this.authResponse);
      return Promise.resolve(this.authResponse);
    } else {
      this.log.debug('Token expired, refresh new one');
      return this.refreshAuthResponse();
    }
  }

  signOut(reRouteUrl): Promise<string> {
    console.log('Facebook Sign out');
    return new Promise( (resolve, reject) => {
      FB.logout((response) => {
        console.log(response);
        this.authResponse = null;
        resolve();
      });
    });
  }

  getToken(): string {
    this.log.debug('getToken', 'authResponse', this.authResponse);
    return this.authResponse ? this.authResponse.accessToken : null;
  }

  getAuthUserAsync(): Promise<AuthUser> {
    console.log('getAuthUserAsync at: ' + Date.now());
    return this.getLoginStatus().then(authResponse => {
      this.log.debug(authResponse);
      this.authResponse = authResponse;
      const auth: any = authResponse;
      return new AuthUser('facebook', auth.name, auth.last_name, auth.email);
    }).catch(err => {
      return Promise.resolve(null);
    });
  }

  getAuthUser(): AuthUser {
    const auth: any = this.authResponse;
    return new AuthUser('facebook', auth.name, auth.last_name, auth.email);
  }

}

// declare let FB: any;
