import { Component, Input } from '@angular/core';

import {HelperEventService, MenuEventService} from '../_services/index';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-modal',
  templateUrl: 'modal.component.html'
})

export class ModalComponent {
  @Input() ok? = false;
  @Input() cancel? = false;
  @Input() confirm? = false;

  @Input() target: string;
  @Input() title: string;
  @Input() body: string;

  constructor(
    private helperEventService: HelperEventService,
    private menuEventService: MenuEventService
  ) {}

  get dismissHelp() {
    return false;
  }

  set dismissHelp(dh: boolean) {
    this.helperEventService.dismissHelp(this.target);
  }

  sendNotification(status: boolean) {
  }

  onDismiss() {
  }

  onConfirm() {
    this.menuEventService.proceed();
}
}
