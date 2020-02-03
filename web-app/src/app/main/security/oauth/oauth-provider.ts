import {IAuthResponse} from './iauth-response';
import {AuthUser} from './auth-user';

export interface OauthProvider {

  isAuthenticated(): boolean;

  // getUserProfile(): IUserProfile;

  getAuthResponse(): IAuthResponse;

  getAuthUserAsync(): Promise<AuthUser>;
  getAuthUser(): AuthUser;

  signIn(provider?: string): Promise<AuthUser>;

  signOut(reRouteUrl?: string);

  // /**
  //  * @deprecated
  //  * @param reRouteUrl: url to route to after sign out
  //  */
  // logOut(reRouteUrl: string);

  getToken(): string;


}
