import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {OauthService} from '../../security/oauth.service';
import {AuthUser} from '../../security/oauth/auth-user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit, AfterContentInit, OnDestroy {
  user: AuthUser;

  constructor(private authService: OauthService, public router: Router) {
  }

  ngOnInit() {

    this.authService.authEmitter.subscribe((auth: AuthUser) => {
      this.user = auth;
      console.log('Navbar get AuthUser from OauthService emitter', this.user);
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.authService.authEmitter.unsubscribe();
  }

  ngAfterContentInit(): void {
    // console.log(' Current Url:' + this.router.routerState.snapshot.url);
  }

  signIn() {
    this.router.navigateByUrl('login');
  }

  signOut() {
    this.user = null;
    this.authService.signOut('home');
  }

  update() {
    // if (this.authService.authEmitter != null) {
    //     this.authService.authEmitter.subscribe((auth: Auth) => {
    //         if (auth != null) {
    //             this.user = auth.user;
    //             console.log(' subscribe userProfile at Navbar. User = ' + this.user.roles);
    //         }
    //     });
    // }
  }

}
