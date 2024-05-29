import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
} from '@angular/animations';

const fadeZoomInOutTimeout = 250;
export const fadeZoomInOut = trigger('fadeZoomInOut', [
  transition('void => *', [
    style({ opacity: '0', transform: 'scale(0.8)' }),
    animate(
      `${fadeZoomInOutTimeout}ms ${fadeZoomInOutTimeout}ms`,
      style({ opacity: '1', transform: 'scale(1)' })
    ),
  ]),
  transition('* => void', [
    style({ opacity: '1', transform: 'scale(1)', position: 'absolute', top: '0'}),
    animate(
      fadeZoomInOutTimeout,
      style({ opacity: '0', transform: 'scale(1.2)', position: 'absolute' , top: '0'})
    ),
  ]),
  transition('* => *', [
    style({ opacity: '0', transform: 'scale(0.8)' }),
    animate(
      fadeZoomInOutTimeout,
      style({ opacity: '1', transform: 'scale(1)' })
    ),
  ]),
]);

export const zoom = trigger('zoom', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9)', filter: 'blur(4px)' }),
    animate(
      '500ms 500ms ease-out',
      style({ opacity: 1, transform: 'scale(1)', filter: 'blur(0)' })
    ),
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'scale(1)', filter: 'blur(0)', position: 'absolute' }),
    animate(
      '500ms ease-in',
      style({ opacity: 0, transform: 'scale(1.1)', filter: 'blur(4px)' })
    ),
  ]),
]);

export const cloudTransitionRight = trigger('cloudTransitionRight', [
  transition('* => *', [
    animate(
      '1s',
      keyframes([
        style({
          opacity: 0.5,
          transform: 'translateX(0)',
        }),
        style({
          opacity: 1,
          transform: 'translateX(calc(-50% - 50vw))',
        }),
        style({
          opacity: 0.5,
          transform: 'translateX(calc(-100% - 105vw))',
        }),
      ])
    ),
  ]),
]);
export const cloudTransitionLeft = trigger('cloudTransitionLeft', [
  transition('* => *', [
    animate(
      '1s',
      keyframes([
        style({
          opacity: 0.5,
          transform: 'translateX(0)',
        }),
        style({
          opacity: 1,
          transform: 'translateX(calc(50% + 50vw))',
        }),
        style({
          opacity: 0.5,
          transform: 'translateX(calc(100% + 105vw))',
        }),
      ])
    ),
  ]),
]);

const fadeInOutTransitionTime = 1000;
const fadeInOutGapTime = 500;
export const fadeInOut = trigger('fadeInOut', [
  transition('void => *', [
    style({ opacity: '0' }),
    animate(
      `${fadeInOutTransitionTime}ms ${
        fadeInOutTransitionTime + fadeInOutGapTime
      }ms`,
      style({ opacity: '1' })
    ),
  ]),
  transition('* => void', [
    style({ opacity: '1', position: 'absolute', left: '0' }),
    animate(fadeInOutTransitionTime, style({ opacity: '0', position: 'absolute'})),
  ]),
  transition('* => *', [
    style({ opacity: '0'}),
    animate(fadeInOutTransitionTime, style({ opacity: '1' })),
  ]),
]);
