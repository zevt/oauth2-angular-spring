export class AuthUser {

  readonly  provider: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;


  getName(): string {
    return this.firstName + ' ' + this.lastName;
  }
  getEmail(): string {
    return this.email;
  }

  constructor(provider: string, firstName: string, lastName: string, email: string) {
    this.provider = provider;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
