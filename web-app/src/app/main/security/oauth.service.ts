import {EventEmitter, Injectable, NgZone} from '@angular/core';
import {GoogleService} from './google/google.service';
import {FacebookService} from './facebook/facebook.service';
import {OauthProvider} from './oauth/oauth-provider';
import {IAuthResponse} from './oauth/iauth-response';
import {AuthUser} from './oauth/auth-user';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class OauthService implements OauthProvider {

  static PROVIDER_NAME;
  provider: OauthProvider = null;
  authEmitter: EventEmitter<AuthUser> = new EventEmitter();

  constructor(private google: GoogleService,  private facebook: FacebookService, private ngZone: NgZone, private router: Router) {

  }

  withProvider(providerName: string): OauthProvider {

    switch (providerName) {
      case 'facebook' :
        this.provider = this.facebook;
        break;
      case 'google':
        this.provider = this.google;
        break;
    }
    return this.provider;

  }

  getAuthResponse(): IAuthResponse {
    return this.provider.getAuthResponse();
  }

  // getUserProfile(): IUserProfile {
  //   //   return this.provider.getUserProfile();
  //   // }

  isAuthenticated(): boolean {
    return this.provider != null &&
    this.provider.isAuthenticated();
  }


  signIn(provider: string): Promise<AuthUser> {
    return this.withProvider(provider).signIn()
      .then(authUser => {
        this.authEmitter.emit(authUser);
        return authUser;
      });
  }

  signOut(reRouteUrl: string) {
    this.getProvider().signOut()
      .then( () => {
        console.log('Sign out by provider: ', this.provider);
        this.ngZone.run( () => {
          console.log('Navigate to login');
          this.router.navigateByUrl('login');
        });
      });
  }

  getToken(): string {
    return this.getProvider().getToken();
  }

  getAuthUserAsync(): Promise<AuthUser> {
    console.log('OauthService getAuthUserAsync');
    if (this.getProvider() != null) {
      return this.provider.getAuthUserAsync();
    } else {
      const fUser = this.facebook.getAuthUserAsync();
      const gUser = this.google.getAuthUserAsync();

      return Promise.all([fUser, gUser]).then( users => {
        const filteredUser = users.filter( u => u != null);
        if (filteredUser.length > 0) {
          const user = filteredUser[0];
          this.authEmitter.emit(user);
          OauthService.PROVIDER_NAME = user.provider;
          return Promise.resolve(user);
        } else {
          return Promise.reject('None of social account was signed in');
        }
      });
    }

  }

  getAuthUser(): AuthUser {
    return this.provider.getAuthUser();
  }

  private getProvider(): OauthProvider {
    if (this.provider != null) {
      return this.provider;
    } else {
      return this.withProvider(OauthService.PROVIDER_NAME);
    }
  }


}
