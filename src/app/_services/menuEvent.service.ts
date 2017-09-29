import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HelperEventService } from './helperEvent.service';

@Injectable()
export class MenuEventService {
  current: { key: string, value: { data: any, success: Function, error: Function } } = {
    key: '', value: { data: {}, success: null, error: null }
  };

  constructor(private helperEventService: HelperEventService) { }

  // Observable string sources
  onEventSource: Map<string, Subject<any>> = new Map();

  getObservable(key: string) {
    return this.getEvent(key).asObservable();
  }

  proceed() {
    this.onEventSource.get(this.current.key).next(this.current.value);
  }

  private getEvent(key: string): Subject<any> {
    let source = this.onEventSource.get(key);
    if (source === undefined) {
      source = new Subject<any>();
      this.onEventSource.set(key, source);
    }
    return source;
  }

  prepareEvent(key: string, value: any, success?: Function, error?: Function) {
    this.current.key = key;
    this.current.value = { data: value, success: success, error: error };
  }

  callEvent(key: string, value: any) {
    this.getEvent(key).next(value);
  }
}
