import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Logger {
  private level = 'info';
  constructor() {
    this.level = environment.logLevel;
  }
}
