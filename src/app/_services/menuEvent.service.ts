import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MenuEventService {

  // Observable string sources
  onTrackSource = new Subject<boolean>();
  recordTrackSource = new Subject<boolean>();
  onMapMoveSource = new Subject<any>();
  modalNotificationSource = new Subject<any>();
  gpsMarkerSource = new Subject<any>();

  // Observable string streams
  onTrack$ = this.onTrackSource.asObservable();
  recordTrack$ = this.recordTrackSource.asObservable();
  onMapMove$ = this.onMapMoveSource.asObservable();
  gpsMarker$ = this.gpsMarkerSource.asObservable();
  modalNotification$ = this.modalNotificationSource.asObservable();

  onTrackStatus(status: boolean) {
    this.onTrackSource.next(status);
  }

  recordTrackStatus(status: boolean) {
    this.recordTrackSource.next(status);
  }

  moveMap(status: any) {
    this.onMapMoveSource.next(status);
  }

  modalNotification(status: any) {
    this.modalNotificationSource.next(status);
  }

  gpsMarker() {
    this.gpsMarkerSource.next();
  }
}
