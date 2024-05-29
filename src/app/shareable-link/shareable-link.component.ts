import { Component, Input } from '@angular/core';
import { SvgComponent } from '../svg/svg.component';
import { Settings } from '../settings/settings.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-shareable-link',
  standalone: true,
  templateUrl: './shareable-link.component.html',
  styleUrl: './shareable-link.component.scss',
  imports: [SvgComponent, CommonModule],
})
export class ShareableLinkComponent {
  @Input({required: true}) settings!: Settings;
  linkCopied: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private clipboard: Clipboard
  ) {}

  share() {
    let queryParams = {
      p: this.settings.participants.map((p) => p.name).join(','),
      t: [this.settings.timer.min, this.settings.timer.sec].join(','),
      useP: this.settings.useParticipants,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });

    setTimeout(() => {
      const currentUrlWithQueryParams =
        location.origin + '/' + this.location.path(true);
      this.clipboard.copy(currentUrlWithQueryParams);
      this.linkCopied = true;

      setTimeout(() => {
        this.linkCopied = false;
      }, 2000);
    }, 0);
  }
}
