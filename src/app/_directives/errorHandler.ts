import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LogService } from '../_services/log.service';

@Injectable()
export class CanimapErrorHandler implements ErrorHandler {
    private log: LogService;
    constructor(injector: Injector) {
        setTimeout(() => this.log = injector.get(LogService));
    }

    handleError(error: any): any {
        // do something with the exception
        this.log.error('Canimap Error: ' + error);
        return error;
    }
}
