import {GoogleAuthResponse} from './auth-response';

export interface GoogleAuth {
  signOut();

  signIn(options?: any);

  currentUser(): Promise<any>;

}

export interface GoogleUser {
  getId();

  isSignedIn();

  getHostedDomain();

  getBasicProfile();

  reloadAuthResponse(): Promise<GoogleAuthResponse>;

  /**
   * return gapi.auth2.AuthResponse
   */
  getAuthResponse(includeAuthorizationData?: boolean): GoogleAuthResponse;
}

export interface BasicProfile {

  getId();

  getName();

  getGivenName();

  getFamilyName();

  getImageUrl();

  getEmail();
}
