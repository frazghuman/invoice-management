import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit } from '@angular/core';

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

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.originalText = this.el.nativeElement.innerText;
    this.truncateText();
    this.addToggleLink();
  }

  private truncateText(): void {
    let text = this.fullText;
    if (this.completeWords) {
      let lastSpace = text.substr(0, this.limit).lastIndexOf(' ');
      text = text.substr(0, lastSpace > 0 ? lastSpace : this.limit);
    } else {
      text = text.substr(0, this.limit);
    }
    this.el.nativeElement.innerText = text + '... ';
  }

  private addToggleLink(): void {
    this.toggleElement = this.renderer.createElement('span');
    this.renderer.addClass(this.toggleElement, 'text-blue-400');
    this.renderer.addClass(this.toggleElement, 'cursor-pointer');
    this.renderer.setProperty(this.toggleElement, 'innerText', 'Show more');
    this.renderer.listen(this.toggleElement, 'click', () => this.toggleText());
    this.renderer.appendChild(this.el.nativeElement, this.toggleElement);
  }

  private toggleText(): void {
    if (this.isFullTextShown) {
      this.truncateText();
      this.addToggleLink();
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'innerText', this.fullText + ' ');
      this.renderer.appendChild(this.el.nativeElement, this.toggleElement);
      this.renderer.setProperty(this.toggleElement, 'innerText', 'Show less');
    }
    this.isFullTextShown = !this.isFullTextShown;
  }
}
