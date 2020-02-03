import {Injectable} from '@angular/core';
import {OauthProvider} from '../oauth/oauth-provider';
import {IAuthResponse} from '../oauth/iauth-response';
import {environment} from '../../../../environments/environment';

import {GoogleAuthResponse} from './model/auth-response';
import {AuthResponse} from '../oauth/auth-response';
import {GoogleAuth, BasicProfile, GoogleUser} from './model/google-oauth';
import {AuthUser} from '../oauth/auth-user';

@Injectable({
  providedIn: 'root'
})
export class GoogleService implements OauthProvider {

  googleAuth;
  env = environment;
  private googleAuthResponse: GoogleAuthResponse;
  private user: GoogleUser = null;

  provider = 'google';

  constructor() {
    this.gapiInit('');
  }

  /**
   * @see https://developers.google.com/identity/sign-in/web/reference?authuser=3
   * @param redirect: endpoint to redirect after login
   */
  private async gapiInit(redirect: string) {

    const auth: GoogleAuth = await this.initSignIn('none');
    this.applyGoogleAuth(auth);
    // .then( auth => this.applyGoogleAuth(auth));
  }

  /**
   * Initialize Google gpi.auth2 object
   *
   */
  private initializeGapiAuth2(): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
        return resolve(gapi.auth2);
      });
    });
  }

  /**
   * Attempt to sign in with prompt mode
   * @param promptMode: possible values are 'none' or 'select_account'
   */
  private initSignIn(promptMode: string): Promise<GoogleAuth> {
    const params = {
      client_id: this.env.google_id,
      // fetch_basic_profile: true,
      scope: 'openid profile email',
      ux_mode: 'popup',
      prompt: promptMode
    };

    return this.initializeGapiAuth2().then(gapiAuth2 => {
      return this.googleAuth = gapi.auth2.init(params).then(
        auth => auth,
        error => error
      );
    });
  }

  private applyGoogleAuth(googleAuth): GoogleUser {
    this.googleAuth = googleAuth;
    if (googleAuth.isSignedIn && googleAuth.isSignedIn.get()) {
      this.user = googleAuth.currentUser.get();
      this.googleAuthResponse = this.user.getAuthResponse(true);
      // console.log(this.googleAuthResponse);

      return this.user;
    } else {
      return null;
    }
  }

  private refresh(): Promise<GoogleAuthResponse> {
    if (this.user != null) {
      return this.user.reloadAuthResponse()
        .then((auth: GoogleAuthResponse) => {
          this.googleAuthResponse = auth;
          return this.googleAuthResponse;
        });
    } else {
      return Promise.reject('not login');
    }
  }

  /**
   * @external link
   * @see https://developers.google.com/identity/sign-in/web/reference#googleusergetauthresponseincludeauthorizationdata
   * @see https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
   * @external link
   *
   * Get Google AuthResponse Object
   *
   */

  getAuthResponse(): IAuthResponse {
    if (this.isAuthenticated()) {
      const authResponse = this.googleAuthResponse;
      console.log(authResponse);
      return new AuthResponse(authResponse.id_token, Math.floor(authResponse.expires_at / 1000), 0);
    }
    return null;
  }

  isAuthenticated() {
    /**
     * Check if GoogleService.AUTH_RESPONSE is null or it already expired
     */
    if (this.googleAuthResponse != null && this.googleAuthResponse.expires_at < Date.now()) {
      // if (gapi.auth2 != null) {
      // console.log('isSignedIn: ' + GoogleService.GoogleAuth.isSignedIn);
      if (this.googleAuth != null) {
        // const googleAuth = gapi.auth2.getAuthInstance();
        if (!!this.googleAuth.isSignedIn && !!this.googleAuth.currentUser) {
          const googleUser = this.googleAuth.currentUser.get();
          this.googleAuthResponse = googleUser.getAuthResponse(true);
        }
      } else {
        // console.log(' gapi.auth2 != null ');
      }
    }
    return this.googleAuthResponse != null && this.googleAuthResponse.expires_at > Date.now();
  }

  /**
   * Return Promise of AuthUser
   */

  signIn(): Promise<AuthUser> {

    return new Promise((resolve, reject) => {
      if (gapi.auth2 != null) {
        const options = new gapi.auth2.SigninOptionsBuilder();
        // options.setFetchBasicProfile(true);
        options.setPrompt('select_account');
        options.setScope('profile').setScope('email');
        gapi.auth2.getAuthInstance().signIn(options)
          .then((user: GoogleUser) => {
            this.googleAuthResponse = user.getAuthResponse();
            const basicProfile: BasicProfile = user.getBasicProfile();
            const authUser = new AuthUser(this.provider,
              basicProfile.getGivenName(), basicProfile.getFamilyName(),
              basicProfile.getEmail());
            resolve(authUser);
          })
          .catch((error) => reject(error));
      } else {
        this.initSignIn('select_account')
          .then(googleAuth => {
            this.applyGoogleAuth(googleAuth);
            this.getAuthUserAsync()
              .then(authUser => resolve(authUser));
          });
      }
    });
  }

  signOut(reRouteUrl): Promise<string> {

    if (gapi.auth2.getAuthInstance() != null) {
      return this.googleAuth.signOut()
        .then(() => {
          this.user = null;
          this.googleAuthResponse = null;
          this.googleAuth = null;
          return '';
        });
    } else {
      this.user = null;
      this.googleAuthResponse = null;
      this.googleAuth = null;
      return Promise.resolve('');
    }
  }

  getToken(): string {

    if (this.googleAuthResponse != null) {
      const expireAt = this.googleAuthResponse.expires_at;
      if (expireAt < Date.now() - 10000) {
        this.refresh().then(response => this.googleAuthResponse = response);
      }
      return this.googleAuthResponse.id_token;
    } else {
      return null;
    }
  }

  getAuthUserAsync(): Promise<AuthUser> {
    return this.getGoogleUser().then(user => {
      if (user) {
        const basicProfile: BasicProfile = user.getBasicProfile();
        return new AuthUser(this.provider, basicProfile.getGivenName(), basicProfile.getFamilyName(), basicProfile.getEmail());
      } else {
        return null;
      }
    }).catch(error => {
        return Promise.resolve(null);
      });
  }

  private getGoogleUser(): Promise<GoogleUser> {
    if (this.user != null) {
      return Promise.resolve(this.user);
    } else {
      console.log('google user is null');
      return new Promise((resolve, reject) => {
        this.initSignIn('none').then(
          (auth: GoogleAuth) => {
            const googleUser = this.applyGoogleAuth(auth);
            resolve(googleUser);
          },
          // TODO: review this code
          error => reject(error));
          // error => resolve(null));
      });
    }
  }

  getAuthUser(): AuthUser {
    if (this.user != null) {
      const basicProfile: BasicProfile = this.user.getBasicProfile();
      return new AuthUser(this.provider, basicProfile.getEmail(), basicProfile.getGivenName(), basicProfile.getFamilyName());
    } else {
      return null;
    }
  }

}

declare const gapi: any;
