import { Component, Input, input } from '@angular/core';
import { SvgComponent } from "../svg/svg.component";
import { cloudTransitionLeft, cloudTransitionRight } from '../animations/fly-in-out.animation';

@Component({
    selector: 'app-transition-clouds',
    standalone: true,
    templateUrl: './transition-clouds.component.html',
    styleUrl: './transition-clouds.component.scss',
    imports: [SvgComponent],
    animations: [cloudTransitionRight, cloudTransitionLeft]
})
export class TransitionCloudsComponent {
  @Input() trigger: any;
}
