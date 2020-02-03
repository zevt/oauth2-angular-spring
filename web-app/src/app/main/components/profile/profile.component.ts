import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthUser} from '../../security/oauth/auth-user';
import {OauthService} from '../../security/oauth.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: AuthUser;
  step = 0;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2990, 0, 1);
  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', [Validators.required]);
  phone = new FormControl('', [Validators.required]);
  gender = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  address = new FormControl('');

  constructor(private oauthSv: OauthService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.user = this.route.snapshot.data.authUser;

  }

  getToken() {
    console.log(this.oauthSv.getToken());
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
      this.name.hasError('required') ? 'You must enter a value' :
      this.phone.hasError('required') ? 'You must enter a value' :
      this.gender.hasError('required') ? 'You must enter a value' :
      this.password.hasError('required') ? 'You must enter a value' : '';
  }

}
