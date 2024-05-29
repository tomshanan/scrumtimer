import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [],
  templateUrl: './svg.component.html',
  styleUrl: './svg.component.scss'
})
export class SvgComponent {
  @Input({required: true}) fileName!: string;
  public svg!: SafeHtml;

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
  ){

  }

  public ngOnChanges(): void {
    if (!this.fileName) {
      this.svg = '';
      return;
    }
    if(!this.svg){
      this.httpClient
        .get(`assets/${this.fileName}.svg`, { responseType: 'text' })
        .subscribe(value => {
          this.svg = this.sanitizer.bypassSecurityTrustHtml(value);
        });
    }
  }
}
