import { Component, OnInit } from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {environment} from '../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})
export class ExperimentComponent implements OnInit {

  config = {
    timeOut: 1500,
    extendedTimeOut: 500,
    autoDismiss: true,
    maxOpened: 1,
    positionClass: 'toast-top-right'
  };

  successConfig = Object.assign({}, this.config);
  topCenterConfig = Object.assign({}, this.config);

  // constructor(private logger: NGXLogger) {
  constructor(private toastr: ToastrService, private log: NGXLogger) {
    // this.logger.registerMonitor(new MyLoggerMonitor());
    // this.logger.error('BLAHBLAHBLAH');

    this.successConfig.positionClass = 'toast-center-center';
    this.successConfig.positionClass = 'inline';
    this.topCenterConfig.positionClass = 'toast-top-center';
  }

  ngOnInit() {
  }

  doIt() {
    // this.logger.info('OK');
    this.toastr.info('Someone just touch me');
    this.log.info('env', environment.envName);
    this.log.debug('env', environment.envName);
    console.log(environment.envName);
  }

  info() {
    this.toastr.info('Someone just touch me', '', this.config);
  }

  error() {
    const response = ['Wrong', 'Not good', 'Try better', 'Sorry'];
    const index = Math.floor(Math.random() * response.length);
    console.log(index);
    const word = response[index];
    console.log(word);
    this.toastr.error(word, '', this.topCenterConfig);
  }

  success() {
    const response = ['Right', 'Correct', 'Perfect', 'Good'];
    const index = Math.floor(Math.random() * response.length);
    console.log(index);
    const word = response[index];
    console.log(word);

    this.toastr.success(word, '', this.successConfig);
  }

  warn() {
    this.toastr.warning('Someone just touch me');
  }

}

// export class MyLoggerMonitor implements NGXLoggerMonitor {
//   onLog(log: NGXLogInterface) {
//     console.log('myCustomLoggerMonitor', log);
//   }
// }
