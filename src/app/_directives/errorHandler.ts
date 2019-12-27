import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {LogService} from '../_services/log.service';
import {SETTINGS} from '../_consts/settings';
import {DeviceDetectorService} from 'ngx-device-detector';

@Injectable()
export class CanimapErrorHandler implements ErrorHandler {
    private log: LogService;
    private deviceDetectorService: DeviceDetectorService;

    constructor(injector: Injector) {
        setTimeout(() => this.log = injector.get(LogService));
        setTimeout(() => this.deviceDetectorService = injector.get(DeviceDetectorService));
    }

    handleError(err: any): any {
        // do something with the exception
        let error = `${SETTINGS.VERSION}`;
        error += `[`;
        error += `${this.deviceDetectorService.getDeviceInfo().device}`;
        error += `:${this.deviceDetectorService.getDeviceInfo().browser}`;
        error += `:${this.deviceDetectorService.getDeviceInfo().browser_version}`;
        error += `:${this.deviceDetectorService.getDeviceInfo().os}`;
        error += `:${this.deviceDetectorService.getDeviceInfo().os_version}`;
        error += `]`;
        error += ` ERROR [${err}]`;
        this.log.error(error);
        return error;
    }
}
