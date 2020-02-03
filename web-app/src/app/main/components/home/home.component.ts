import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any;
  constructor(private router: Router, private http: HttpClient, private log: NGXLogger) {
  }

  ngOnInit() {
  }

  getInfo() {
    this.http.get('api/v1/info').subscribe( res => {
      console.log(res);
    });
  }

  getUser() {
    this.http.get('api/v1/user').subscribe( res => {
      this.log.info(res);
      this.user = JSON.stringify(res);
    });
  }
}
