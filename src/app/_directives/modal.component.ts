import {Component, Input, OnInit} from '@angular/core';

import {MenuEventService} from '../_services/index';

@Component({
  moduleId: module.id.toString(),
  selector: 'modal',
  templateUrl: 'modal.component.html'
})

export class ModalComponent {
  @Input() ok?: boolean = false;
  @Input() cancel?: boolean = false;
  @Input() confirm?: boolean = false;

  @Input() target: string;
  @Input() title: string;
  @Input() body: string;
  constructor(private menuEventService: MenuEventService) {
    // this.id = this.target;
  }

  sendNotification(status: boolean) {
    this.menuEventService.modalNotification({source: this.target, status: status});
  }

  onDismiss() {
      this.sendNotification(true);
  }

  onConfirm() {
    this.sendNotification(false);
  }
}
