import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TimerNotificationsService } from '../timer-notifications.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-cloud',
  standalone: true,
  imports: [HttpClientModule, AsyncPipe],
  templateUrl: './cloud.component.html',
  styleUrl: './cloud.component.scss'
})
export class CloudComponent implements OnInit, OnChanges{
  @Input({required: true}) fileName!: string;
  @Input({required: true}) size!: 'md'|'sm'|'lg';

  public svg: any;
  timeOffset = Math.floor(Math.random() * 500);
  speedOffset = Math.floor(Math.random() * 150)/10;
  verticalOffset = Math.floor(Math.random() * 100) / 1.5;
  resetTransition = false;
  paused$ = this.timerNotifications.paused

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private timerNotifications: TimerNotificationsService
  ){

  }

  ngOnInit(): void {
    this.timerNotifications.timerReset.subscribe(() => {
      this.resetTransition = true;
      this.timeOffset = Math.floor(Math.random() * 500);
      setTimeout(() => {
        this.resetTransition = false;
      }, 300);
    })
  }


  public ngOnChanges(): void {
    if (!this.fileName) {
      this.svg = '';
      return;
    }
    if(!this.svg){
      this.httpClient
        .get(`assets/${this.fileName}.svg`, { responseType: 'text' })
        .subscribe(value => {
          this.svg = this.sanitizer.bypassSecurityTrustHtml(value);
        });
    }
  }

}
