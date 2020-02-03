import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularMaterialModule} from './angular-material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import {MatGridListModule} from '@angular/material/grid-list';
// import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatGridListModule,
    // FlexLayoutModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({ positionClass: 'inline' })

  ],
  exports: [
    HttpClientModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatGridListModule,
    // FlexLayoutModule,
    ReactiveFormsModule,
    ToastrModule
  ]

})
export class SharedModule { }
