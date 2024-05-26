import { Directive, ElementRef, Input, Renderer2, OnInit, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[appShowMore]',
  standalone: true
})
export class ShowMoreDirective implements OnInit {
  @Input() fullText: string = '';
  @Input() limit: number = 100;
  @Input() completeWords: boolean = true;

  private originalText: string = '';
  private isFullTextShown: boolean = false;
  private toggleElement!: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.originalText = this.el.nativeElement.innerText;
    this.truncateText();
    this.addToggleLink();
  }

  private truncateText(): void {
    let text = this.fullText;
    if (text && text.length > this.limit) {
      if (this.completeWords) {
        const lastSpace = text.substr(0, this.limit).lastIndexOf(' ');
        text = text.substr(0, lastSpace > 0 ? lastSpace : this.limit);
      } else {
        text = text.substr(0, this.limit);
      }
      this.el.nativeElement.innerText = text + '... ';
    } else {
      this.el.nativeElement.innerText = text;
    }
    this.cdr.markForCheck();
  }

  private addToggleLink(): void {
    if (this.fullText && this.el.nativeElement.innerText.length !== this.fullText.length) {
      this.toggleElement = this.renderer.createElement('span');
      this.renderer.addClass(this.toggleElement, 'text-blue-400');
      this.renderer.addClass(this.toggleElement, 'cursor-pointer');
      this.renderer.setProperty(this.toggleElement, 'innerText', 'Show more');
      this.renderer.listen(this.toggleElement, 'click', (event: Event) => {
        event.stopPropagation();
        this.toggleText();
      });
      this.renderer.appendChild(this.el.nativeElement, this.toggleElement);
    }
  }

  private toggleText(): void {
    if (this.isFullTextShown) {
      this.truncateText();
      this.addToggleLink(); // Re-add the toggle link after truncating the text
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'innerText', this.fullText + ' ');
      this.renderer.appendChild(this.el.nativeElement, this.toggleElement);
      this.renderer.setProperty(this.toggleElement, 'innerText', 'Show less');
    }
    this.isFullTextShown = !this.isFullTextShown;
    this.cdr.detectChanges();
  }
}
