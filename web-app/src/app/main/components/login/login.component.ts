import { Component, OnInit } from '@angular/core';
import {OauthService} from '../../security/oauth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthUser} from '../../security/oauth/auth-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // display = 'none';
  display = 'block';
  mode = 'sign-in';

  constructor(private oauthSv: OauthService, private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    console.log('Login component getAuthUserAsync');
    this.oauthSv.getAuthUserAsync()
      .then( (authUser: AuthUser) => {
        let url = this.route.snapshot.queryParams.reRouteUrl;
        if (!url) {
          url = 'home';
        }
        this.router.navigateByUrl(url);
      }).catch(error => {
        console.log(error);
    });
  }

  signIn(provider: string) {
    console.log('provider: ' + provider);
    this.oauthSv.withProvider(provider);
    // this.mode = 'sign-in';
    this.oauthSv.signIn(provider).then(auth => {
      console.log(auth);
      this.router.navigateByUrl(this.route.snapshot.queryParams.reRouteUrl);
    }).catch(error => {
      console.log(' Cannot sign In');
      console.log(error);
    });
  }

  signUp(provider: string) {
    this.oauthSv.withProvider(provider)
    .signIn(provider).then(auth => {
      this.router.navigateByUrl(this.route.snapshot.queryParams.reRouteUrl);
    }).catch(error => {
    });

  }
}
