import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import {
  fadeInExpandOnEnterAnimation,
  fadeOutCollapseOnLeaveAnimation,
  flipInXOnEnterAnimation,
  shakeAnimation,
} from 'angular-animations';
import { makeParticipant } from '../utils';
import { SvgComponent } from '../svg/svg.component';

export interface Participant {
  name: string;
  include: boolean;
}

export interface Settings {
  timer: {
    min: number;
    sec: number;
  };
  useParticipants: boolean;
  participants: Participant[];
  randomizeOrder: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  animations: [
    fadeOutCollapseOnLeaveAnimation(),
    fadeInExpandOnEnterAnimation(),
    flipInXOnEnterAnimation(),
    shakeAnimation({ anchor: 'shake', direction: '=>', duration: 1000 }),
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CheckboxComponent,
    SvgComponent,
  ],
})
export class SettingsComponent implements OnInit, OnChanges {
  @Input({ required: true }) settings!: Settings;
  @Output() settingsChange = new EventEmitter<Settings>();

  settingsForm!: FormGroup;
  newName = new FormControl('', [Validators.min(1), Validators.max(20)]);
  alertParticipant: string = '';

  get min() {
    return this.settingsForm.get('timer.min') as FormControl;
  }
  get sec() {
    return this.settingsForm.get('timer.sec') as FormControl;
  }
  get participants() {
    return this.settingsForm.get('participants') as FormArray<FormGroup>;
  }
  get useParticipants() {
    return this.settingsForm.get('useParticipants') as FormControl;
  }

  constructor(
    private fb: FormBuilder
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['settings'] && this.settingsForm) {
      this.initForm(false);
    }
  }
  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      timer: this.fb.group({
        min: [2, Validators.pattern(/[0-9]+/)],
        sec: [0, Validators.pattern(/[0-9]+/)],
      }),
      useParticipants: [true],
      participants: this.fb.array<FormGroup[]>([]),
      randomizeOrder: [true],
    });

    this.initForm(false);
    this.settingsForm.valueChanges.subscribe((v) =>
      this.settingsChange.emit(v)
    );
  }

  initForm(emit?: boolean) {
    this.settingsForm.patchValue(this.settings ?? {}, { emitEvent: emit });

    // remove participants that aren't in the settings
    const participantNames = this.settings.participants.map((p) => p.name);
    this.participants.controls.forEach((control, index) => {
      if (!participantNames.includes(control.value.name)
      ) {
        this.removeParticipant(index);
      }
    });

    // add participants that are in the settings but not in the form
    this.settings.participants.forEach((p) => this.addParticipant(p, emit));
  }

  addParticipantFromNameField() {
    let name = this.newName.value?.toLowerCase();
    if (!name || name.length === 0) {
      return;
    }
    if (this.participants.value.map((v) => v.name).includes(name)) {
      this.alertParticipant = name;
      return;
    }
    this.addParticipant({ name, include: true });
    this.newName.setValue('');
    this.newName.markAsPristine();
  }

  addParticipant(participant: Participant, emit: boolean = true) {
    const { name, include } = participant;
    if (name.length === 0) {
      return;
    }

    // don't add duplicates
    if(this.participants.value.map((v) => v.name).includes(name)) {
      return;
    }

    this.participants.insert(this.participants.length, this.fb.group(makeParticipant(name, include)), {
      emitEvent: emit,
    });
  }

  removeParticipant(i: number) {
    this.participants.removeAt(i);
  }

  increaseTime() {
    let sec = this.sec.value;
    let min = this.min.value;
    if (sec < 45) {
      this.sec?.setValue(sec + 15);
    } else {
      this.sec?.setValue(0);
      this.min?.setValue(min + 1);
    }
  }
  decreaseTime() {
    let sec = this.sec.value;
    let min = this.min.value;
    if (sec === 0 && min === 0) {
      return;
    }
    if (sec > 0) {
      this.sec?.setValue(sec - 15);
    } else {
      this.sec?.setValue(45);
      this.min?.setValue(min - 1);
    }
  }

  pad(v: number) {
    return v.toString().padStart(2, '0');
  }


}
