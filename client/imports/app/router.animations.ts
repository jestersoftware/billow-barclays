import { trigger, state, animate, style, transition } from '@angular/animations';

export function moveIn() {
  return trigger('moveIn', [
    state('void', style({ position: 'fixed', width: '100%' })),
    state('*', style({ position: 'fixed', width: '100%' })),
    transition(':enter', [
      style({ opacity: '0', transform: 'translateX(100px)' }),
      animate('.6s ease-in-out', style({ opacity: '1', transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      style({ opacity: '1', transform: 'translateX(0)' }),
      animate('.3s ease-in-out', style({ opacity: '0', transform: 'translateX(-200px)' }))
    ])
  ]);
}

export function fallIn() {
  return trigger('fallIn', [
    transition(':enter', [
      style({ opacity: '0', transform: 'translateY(40px)' }),
      animate('.4s .2s ease-in-out', style({ opacity: '1', transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      style({ opacity: '1', transform: 'translateX(0)' }),
      animate('.3s ease-in-out', style({ opacity: '0', transform: 'translateX(-200px)' }))
    ])
  ]);
}

export function moveInLeft() {
  return trigger('moveInLeft', [
    transition(':enter', [
      style({ opacity: '0', transform: 'translateX(-100px)' }),
      animate('.6s .2s ease-in-out', style({ opacity: '1', transform: 'translateX(0)' }))
    ])
  ]);
}

// export function moveDesktop() {
//   return trigger('moveDesktop', [
//     state('100', style({
//       left: '100%',
//       transform: 'translate(-100%, 0)'
//     })),
//     state('90', style({
//       left: '90%',
//       transform: 'translate(-90%, 0)'
//     })),
//     state('80', style({
//       left: '80%',
//       transform: 'translate(-80%, 0)'
//     })),
//     state('70', style({
//       left: '70%',
//       transform: 'translate(-70%, 0)'
//     })),
//     state('60', style({
//       left: '60%',
//       transform: 'translate(-60%, 0)'
//     })),
//     state('50', style({
//       left: '50%',
//       transform: 'translate(-50%, 0)'
//     })),
//     state('40', style({
//       left: '40%',
//       transform: 'translate(-40%, 0)'
//     })),
//     state('30', style({
//       left: '30%',
//       transform: 'translate(-30%, 0)'
//     })),
//     state('20', style({
//       left: '20%',
//       transform: 'translate(-20%, 0)'
//     })),
//     state('10', style({
//       left: '10%',
//       transform: 'translate(-10%, 0)'
//     })),
//     state('0', style({
//       left: '0',
//       transform: 'translate(0, 0)'
//     })),
//     // transition('void => *', []),
//     transition('* => *', animate('300ms ease-in')) //,
//     // transition('active => inactive', animate('100ms ease-out'))
//   ]);
// }
