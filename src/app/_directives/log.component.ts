import { Component, OnInit } from '@angular/core';

import { LogService } from '../_services/log.service';

@Component({
    moduleId: module.id.toString(),
    selector: 'app-log',
    templateUrl: 'log.component.html'
})

export class LogComponent implements OnInit {
    message: any;

    constructor(private logService: LogService) { }

    ngOnInit() {
        this.logService.getMessage().subscribe(message => { this.message = message; });
    }
}

