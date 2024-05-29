import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  input,
} from '@angular/core';
import { TimerNotificationsService } from '../timer-notifications.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-display.component.html',
  styleUrl: './timer-display.component.scss',
})
export class TimerDisplayComponent {
  @Input() isRunningOver = false;
  @Output() isRunningChange = new EventEmitter<boolean>();
  @Output() millisecondsChange = new EventEmitter<number>();

  isRunning = false;

  startTime: number = Date.now();
  elapsedTime: number = 0;

  timerId!: ReturnType<typeof setInterval>;

  constructor(private timerService: TimerNotificationsService) {}
  clearTimer() {
    this.startTime = Date.now();
    this.elapsedTime = 0;
  }

  pause() {
    this.startStopTimer(false);
    this.timerService.paused.next(true)
  }

  restartTimer() {
    this.clearTimer();
    this.startStopTimer(true);
    this.timerService.timerReset.next();
  }

  startStopTimer(state?: boolean) {
    if (state !== false && !this.isRunning) {
      this.startTime =
        Date.now() - (Math.floor(this.elapsedTime / 1000) + 1) * 1000;

      this.timerId = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
        this.millisecondsChange.emit(this.elapsedTime);
      }, 15);
      this.isRunning = true;
      this.isRunningChange.emit(true);
      this.timerService.paused.next(false)
    } else if (state !== true && this.isRunning) {
      clearInterval(this.timerId);
      this.isRunning = false;
      this.elapsedTime = Date.now() - this.startTime;
      this.isRunningChange.emit(false);
      this.millisecondsChange.emit(this.elapsedTime);
      this.timerService.paused.next(true)

    }
  }
}
