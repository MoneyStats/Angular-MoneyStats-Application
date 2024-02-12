import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  keyframes,
  stagger,
} from '@angular/animations';

export const fader = trigger('routeAnimations', [
  transition('* <=> *', [
    // Set a default  style for enter and leave
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          transform: 'scale(0) translateY(100%)',
        }),
      ],
      { optional: true }
    ),
    // Animate the new page in
    query(
      ':enter',
      [
        animate(
          '600ms ease',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ],
      { optional: true }
    ),
  ]),
]);

export const slideUp = trigger('routeAnimations', [
  transition('* => *', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate(1000, style({ transform: 'translateY(0%)', opacity: 1 })),
  ]),
]);

export const enterSlide = trigger('routeAnimations', [
  transition('* => *', [
    // each time the binding value changes
    query(
      ':enter',
      [
        stagger(2000, [
          style({ transform: 'translateY(100%)', opacity: 0 }),
          animate(2000, style({ transform: 'translateY(-100%)', opacity: 1 })),
        ]),
      ],
      {
        optional: true,
      }
    ),
  ]),
]);

export const fadeSliderOLD = trigger('routeAnimations', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(250px)' }),
    animate(500, style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate(500, style({ opacity: 0, transform: 'translateY(250px)' })),
  ]),
]);

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(250px)' }),
    animate(500, style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate(500, style({ opacity: 0, transform: 'translateY(250px)' })),
  ]),
]);

export const fadeSlider = trigger('routeAnimations', [
  transition('* => *, :enter', [
    style({ opacity: 0, transform: 'translateY(250px)' }),
    animate(500, style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition('* => *, :leave', [
    animate(500, style({ opacity: 0, transform: 'translateY(250px)' })),
  ]),
]);
