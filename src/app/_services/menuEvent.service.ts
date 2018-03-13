import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

class Call {
  key: string;
  value?: { data: any, success: Function, error: Function };
  constructor(key: string, value?: any) {
    this.key = key;
    this.value = value;
  }
}

@Injectable()
export class MenuEventService {
  current: Call = { key: '', value: { data: {}, success: null, error: null } };
  waitingCalls = new Array<Call>();
  state = 'move';

  constructor() { }

  // Observable string sources
  onEventSource: Map<string, Subject<any>> = new Map();

  getObservableAndMissedEvents(key: string): any {
    const events = new Array<Call>();
    this.waitingCalls.forEach(
      call => {
        if (call.key === key) {
          events.push(call);
        }
      }
    );
    return { observable: this.getEvent(key).asObservable(), values: events.map(event => event.value) };
  }

  getObservable(key: string): any {
    return this.getEvent(key).asObservable();
  }

  prepareEvent(key: string, value?: any, success?: Function, error?: Function) {
    this.current.key = key;
    this.current.value = { data: value, success: success, error: error };
  }

  proceed() {
    this.callEvent(this.current.key, this.current.value);
  }

  callEvent(key: string, value?: any) {
    this.state = key;
    if (!this.isEvent(key)) {
      this.waitingCalls.push(new Call(key, value));
    } else {
      this.getEvent(key).next(value);
    }
  }

  private isEvent(key: string) {
    return this.onEventSource.has(key);
  }

  private getEvent(key: string): Subject<any> {
    let source = this.onEventSource.get(key);
    if (!source) {
      source = new Subject<any>();
      this.onEventSource.set(key, source);
    }
    return source;
  }
}
