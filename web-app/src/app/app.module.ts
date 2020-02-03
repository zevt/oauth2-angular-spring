import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './routers/app-routing.module';
import {LoginComponent} from './main/components/login/login.component';
import {NavbarComponent} from './main/components/navbar/navbar.component';
import {HomeComponent} from './main/components/home/home.component';
import {ProfileComponent} from './main/components/profile/profile.component';
import {SharedModule} from './shared/shared.module';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {environment} from '../environments/environment';
import {SecurityResolver} from './main/security/resolvers/security-resolver';
import {SecurityInterceptor} from './main/interceptor/security.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    // ExperimentComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: !environment.production ? NgxLoggerLevel.TRACE : NgxLoggerLevel.OFF,
      serverLogLevel: NgxLoggerLevel.LOG,
    }),
  ],
  providers: [SecurityResolver,
    {provide: HTTP_INTERCEPTORS, useClass: SecurityInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
