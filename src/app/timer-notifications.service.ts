import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerNotificationsService {
  timerReset = new Subject<void>()
  paused = new BehaviorSubject<boolean>(false)
  constructor() { }
}
