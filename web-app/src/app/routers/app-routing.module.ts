import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from '../main/components/login/login.component';
import {ExperimentComponent} from '../main/components/experiment/experiment.component';
import {HomeComponent} from '../main/components/home/home.component';
import {SecurityResolver} from '../main/security/resolvers/security-resolver';
import {SecurityGuard} from '../main/security/guards/security.guard';
import {ProfileComponent} from '../main/components/profile/profile.component';


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  // {path: 'x', component: ExperimentComponent},
  {path: 'login', component: LoginComponent},
  // {path: 'login', component: LoginComponent,  resolve: {authResolver: AuthResolver}},
  // canActivate: [LoginGuard],
  {path: 'home', component: HomeComponent, canActivate: [SecurityGuard]},
  // {path: 'profile', component: ProfileComponent, canActivate: [SecurityGuard]},
  // TODO: add resolver back to ProfileComponent
  // {path: 'profile', component: ProfileComponent, canActivate: [SecurityGuard], resolve: { authUser:  SecurityResolver} },
  {path: 'profile', component: ProfileComponent},

  // {path: '', component: HomeComponent, resolve: {authResolver: AuthResolver}},
  // when the route starts with user, load UserModule from path 'app/user/user.module
  // {path: 'user', loadChildren: 'app/user/user.module#UserModule'}
  // {path: 'path', loadChildren: 'app/modules/path.module#PathModule', canActivate: [AuthGuard]},
  // {path: 'smart-card', loadChildren: './../smart-card/smart-card.module#SmartCardModule', canActivate: [SecurityGuard]},
  // , canActivate: [AuthGuard]
  // {path: 'analyzer', component: AnalyzerComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
