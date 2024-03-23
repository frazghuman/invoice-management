import { animate, state, style, transition, trigger } from "@angular/animations";

const fadeInOut = () => {
    return trigger('fadeInOut', [
        state('void', style({
          opacity: 0,
          height: '0px', // Start from 0 height
          overflowY: 'hidden'
        })),
        state('*', style({
          opacity: 1,
          height: '*', // Allow dynamic height
          overflowY: 'hidden'
        })),
        transition('void <=> *', animate('50ms ease-in-out')),
      ])
}

export default fadeInOut();