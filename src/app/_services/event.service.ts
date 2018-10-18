import { Injectable } from '@angular/core';
import { Observable ,  ReplaySubject ,  Subscription } from 'rxjs';
import { LogService } from './log.service';
import { Events } from '../_consts/events';

@Injectable()
export class EventService {

  state = Events.MAP_MOVE;

  constructor(
    private log: LogService
  ) { }

  // Observable string sources
  onEventSource: Map<string, ReplaySubject<any>> = new Map();

  subscribe(key: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    this.log.debug('subscribed to: ' + key);
    return this.getEvent(key).asObservable().subscribe(next, error, complete);
  }

  call(key: string, value?: any) {
    this.log.debug('call: ' + key);
    this.state = key;
    this.getEvent(key).next(value);
  }

  private getEvent(key: string): ReplaySubject<any> {
    let source = this.onEventSource.get(key);
    if (!source) {
      source = new ReplaySubject(1);
      this.onEventSource.set(key, source);
    }
    return source;
  }
}
