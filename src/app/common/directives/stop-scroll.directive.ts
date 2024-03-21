import { Directive, ElementRef, HostListener, Input, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appStopScroll]',
  standalone: true
})
export class StopScrollDirective {
  @Input() appStopScroll!: boolean;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID to determine the platform
  ) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    // Execute only if we're on the browser platform
    if (isPlatformBrowser(this.platformId)) {
      if (this.appStopScroll) {
        // Prevent scrolling
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
      } else {
        // Re-enable scrolling
        this.renderer.setStyle(document.body, 'overflow', 'visible');
      }
    }
  }

  ngOnChanges() {
    // Apply the initial state based on the input value, but only if on the browser platform
    if (isPlatformBrowser(this.platformId)) {
      if (this.appStopScroll) {
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
      } else {
        this.renderer.setStyle(document.body, 'overflow', 'visible');
      }
    }
  }
}
