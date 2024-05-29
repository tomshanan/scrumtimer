import { TimerNotificationsService } from './timer-notifications.service';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TimerDisplayComponent } from './timer-display/timer-display.component';
import { CloudComponent } from './cloud/cloud.component';
import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { SvgComponent } from './svg/svg.component';
import {
  Settings,
  SettingsComponent,
  Participant,
} from './settings/settings.component';
import { getTardyName, makeParticipant, shuffle } from './utils';
import { StorageService } from './storage.service';
import { defaultSession, defaultSettings } from './app.constants';
import { sessionState, BgState, Session } from './svg/interfaces';

import {
  cloudTransitionLeft,
  cloudTransitionRight,
  fadeZoomInOut,
  zoom,
} from './animations/fly-in-out.animation';
import { Subject, filter, take } from 'rxjs';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { TipsComponent } from './tips/tips.component';
import { BackgroundCloudsComponent } from "./background-clouds/background-clouds.component";
import { TransitionCloudsComponent } from "./transition-clouds/transition-clouds.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None,
    animations: [cloudTransitionRight, cloudTransitionLeft, zoom, fadeZoomInOut],
    imports: [
        RouterOutlet,
        CommonModule,
        TimerDisplayComponent,
        CloudComponent,
        SvgComponent,
        SettingsComponent,
        ClipboardModule,
        TipsComponent,
        BackgroundCloudsComponent,
        TransitionCloudsComponent
    ]
})
export class AppComponent implements OnInit {
  @ViewChild(TimerDisplayComponent, { static: false })
  timerComponent?: TimerDisplayComponent;

  sessionState = sessionState;
  session: Session = { ...defaultSession };
  isRunning: boolean = false;
  ms: number = 0;

  timerLimitsConfig = {
    warning: 5,
    alarm: 10,
  };
  bgState: BgState = 'day';
  isWarning: boolean = false;
  isAlarm: boolean = false;

  settings: Settings = { ...defaultSettings };

  destroyListenerToRoute = new Subject<void>();

  linkCopied: boolean = false;

  get totalSessionTime(): number {
    return this.session.timeLog.reduce((t, log) => t + log.time, 0);
  }

  get currentParticipant() {
    return this.session?.participants?.[this.session.currentParticipant];
  }
  get nextParticipant() {
    return (
      this.session?.participants?.[this.session.currentParticipant + 1] || null
    );
  }
  get showRalph() {
    return this.isWarning && this.ms / 1000 > this.timerLimitsConfig.alarm - 15;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private storageService: StorageService,
    private timeService: TimerNotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private location: Location
  ) {}

  ngOnInit(): void {
    let storedSettings = this.storageService.getStoredSettings();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe((event) => {
        console.log('updated settings from sub');
        let params = this.route.snapshot.queryParamMap;
        this.initSettings(params, storedSettings);
        this.storeSettings(this.settings);
      });

    // this.route.queryParamMap.pipe(takeUntil(this.destroyListenerToRoute)).subscribe((params) => {
    //   if(params.keys.length > 0){
    //     this.destroyListenerToRoute.next()
    //     this.router.navigate([], {
    //       relativeTo: this.route,
    //       queryParams: {}
    //     });
    //     console.log('destroyed listener')
    //   }
    //   console.log('updated settings from sub')

    // });
  }

  initSettings(params: ParamMap, storedSettings: Settings) {
    let queryParams = this.getSettingsFromQueryParams(params);

    let participants: Participant[] =
      queryParams.participants ??
      storedSettings?.participants ??
      defaultSettings.participants ??
      [];
    let timer =
      queryParams.timer ?? storedSettings?.timer ?? defaultSettings.timer;
    let useParticipants: boolean =
      queryParams.useParticipants ??
      storedSettings?.useParticipants ??
      defaultSettings.useParticipants;

    this.settings = {
      participants,
      timer,
      useParticipants,
    };
  }

  getSettingsFromQueryParams(params: ParamMap): {
    [K in keyof Settings]: Settings[K] | null;
  } {
    let participants: Participant[] | null = null;
    let timer: Settings['timer'] | null = null;
    let useParticipants: boolean | null = null;

    if (params.has('p')) {
      const names = (params.get('p') as string).split(',');
      if (names.length > 0) {
        participants = names.map((n) => makeParticipant(n, true));
      }
    }
    if (params.has('t')) {
      let time = (params.get('t') as string).split(',').map((v) => +v);
      if (
        time.length === 2 &&
        time.every((v: unknown) => typeof v === 'number')
      ) {
        let [min, sec] = time as number[];
        if (!(sec >= 0 && sec <= 45)) {
          sec = 0;
        } else if (![0, 15, 45].some((v) => sec === v)) {
          sec = sec - (sec % 15);
        }
        timer = { min, sec };
      }
    }
    if (params.has('useP')) {
      let useP = params.get('useP');
      useParticipants = useP === 'true';
    }

    return {
      participants,
      timer,
      useParticipants,
    };
  }

  storeSettings(settings: Settings) {
    this.storageService.storeSettings(settings);
  }

  updateMs(ms: number) {
    this.ms = ms;
    let s = ms / 1000;
    if (s > this.timerLimitsConfig.alarm) {
      if (this.bgState !== 'dark') {
        this.toggleClass('dark');
        this.isAlarm = true;
      }
      return;
    }
    if (s > this.timerLimitsConfig.warning) {
      if (this.bgState !== 'dusk') {
        this.toggleClass('dusk');
        this.isWarning = true;
      }
      return;
    }

    if (this.bgState !== 'day') {
      this.toggleClass('day');
      this.isWarning = false;
      this.isAlarm = false;
    }
  }

  toggleClass(state: BgState): void {
    this.document.body.classList.remove('day', 'dusk', 'dark');
    this.document.body.classList.add(state);
    this.bgState = state;
  }

  startSession() {
    const { participants, timer, useParticipants } = this.settings;
    let participantNames: string[] = [];

    if (useParticipants) {
      participantNames = participants
        .filter((p) => p.include)
        .map((p) => p.name);
      shuffle(participantNames);
    }

    if (participantNames.length === 0 || !useParticipants) {
      participantNames.push(getTardyName());
    }

    this.session = {
      state: sessionState.STARTED,
      participants: shuffle(participantNames),
      currentParticipant: 0,
      timeLog: [],
    };

    const secLimit = timer.min * 60 + timer.sec;
    this.timerLimitsConfig.alarm = secLimit;

    if (secLimit > 60) {
      this.timerLimitsConfig.warning = secLimit - 30;
    } else if (secLimit >= 45) {
      this.timerLimitsConfig.warning = secLimit - 15;
    } else {
      this.timerLimitsConfig.warning = secLimit - 5;
    }

    setTimeout(() => {
      this.timerComponent?.startStopTimer(true);
      this.timeService.paused.next(false);
    }, 1500);
  }

  snooze() {
    const participants = this.session.participants;
    const currentIndex = this.session.currentParticipant;
    const current = participants[currentIndex];
    participants.splice(currentIndex, 1);
    participants.push(current);
    this.timerComponent?.restartTimer();
  }

  logCurrentParticipant() {
    let time = this.ms ?? 0;
    this.session.timeLog.push({
      time,
      flag: this.isAlarm,
      participant: this.currentParticipant,
    });
  }

  next() {
    this.logCurrentParticipant();
    this.session.currentParticipant++;
    this.timerComponent?.restartTimer();
  }

  finish() {
    this.logCurrentParticipant();
    this.timerComponent?.clearTimer();
    this.timerComponent?.startStopTimer(false);
    this.timeService.paused.next(false);
    this.session.state = sessionState.FINISHED;
  }

  addSpeaker() {
    const newName = getTardyName(this.session.participants);
    this.session.participants.push(newName);
    this.next();
  }

  restart() {
    this.session = { ...defaultSession };
    this.document.defaultView?.scrollTo(0, 0);
  }

  share() {
    let queryParams = {
      p: this.settings.participants.map((p) => p.name).join(','),
      t: [this.settings.timer.min, this.settings.timer.sec].join(','),
      useP: this.settings.useParticipants,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });

    setTimeout(() => {
      const currentUrlWithQueryParams =
        location.origin + '/' + this.location.path(true);
      this.clipboard.copy(currentUrlWithQueryParams);
      this.linkCopied = true;

      setTimeout(() => {
        this.linkCopied = false;
      }, 2000);
    }, 0);
  }
}
