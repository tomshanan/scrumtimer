import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Host,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [],
  template: '',
  styleUrl: './svg.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SvgComponent {
  @Input({ required: true }) fileName!: string;
  @Input({ required: false }) svgStyles: string = '';
  @HostBinding('innerHTML') public svg!: SafeHtml;


  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.fileName) {
      this.svg = '';
      return;
    }
    if (!this.svg || changes['fileName']) {
      this.updateSVG();
    }
  }

  updateSVG() {
    this.httpClient
      .get(`assets/${this.fileName}.svg`, { responseType: 'text' })
      .subscribe((value) => {
        this.svg = this.sanitizer.bypassSecurityTrustHtml(value);
        setTimeout(() => {
          if (this.svgStyles) {
            this.updateStyles();
          }
        }, 0);
      });
  }

  updateStyles() {
    if (!this.svgStyles || this.svgStyles === '' || !this.svg) {
      return;
    }
    let svg = this.elRef.nativeElement.querySelector('svg');
    if (svg) {
      this.renderer.setAttribute(svg, 'style', this.svgStyles);
    }
  }
}
