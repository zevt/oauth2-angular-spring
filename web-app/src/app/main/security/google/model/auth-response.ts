/**
 * @see https://developers.google.com/identity/sign-in/web/reference?authuser=3#googleuserreloadauthresponse
 */

export interface GoogleAuthResponse {
  // 	The Access Token granted.
  // access_token: string;
  // 	The ID Token granted.
  id_token: string;

  scope: string;
  // 	The number of seconds until the Access Token expires.
  expires_in: number;
  // The timestamp in millisecond at which the user first granted the scopes requested.
  first_issued_at: number;
  // The timestamp in millisecond at which the Access Token will expire.
  expires_at: number;

}
