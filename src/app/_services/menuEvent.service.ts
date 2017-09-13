import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HelperEventService } from './helperEvent.service';

@Injectable()
export class MenuEventService {
  current: {key: string, value: any} = { key: '', value:  {}};

  constructor(private helperEventService: HelperEventService) {}

  // Observable string sources
  onEventSource: Map<string, Subject<any>> = new Map();

  getObservable(key: string) {
    let source = this.onEventSource.get(key);
    if (source === undefined) {
      source = new Subject<any>();
      this.onEventSource.set(key, source);
    }
    return source.asObservable();
  }

  proceed() {
    this.onEventSource.get(this.current.key).next(this.current.value);
  }

  prepareEvent(key: string, value: any) {
    this.current.key = key;
    this.current.value = value;
  }

  callEvent(key: string, value: any) {
    this.onEventSource.get(key).next(value);
  }
}
