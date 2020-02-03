import {User} from './User';

export class Auth {

    user: User;
    accessToken: string;
    expiresAt: number;

    constructor(user: User, accessToken: string, expiresAt: number) {
        this.user = user;
        this.accessToken = accessToken;
        this.expiresAt = expiresAt;
    }
}
