import { TestBed } from '@angular/core/testing';

import { TimerNotificationsService } from './timer-notifications.service';

describe('TimerNotificationsService', () => {
  let service: TimerNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
