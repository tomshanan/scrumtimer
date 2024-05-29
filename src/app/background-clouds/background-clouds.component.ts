import { Component } from '@angular/core';
import { CloudComponent } from "../cloud/cloud.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-background-clouds',
    standalone: true,
    templateUrl: './background-clouds.component.html',
    styleUrl: './background-clouds.component.scss',
    imports: [CloudComponent, CommonModule]
})
export class BackgroundCloudsComponent {

  clouds: {fileName: string, size: 'sm'|'md'|'lg'}[]= [
    {
      fileName: "cloudSmall 1",
      size: "sm"
    },
    {
      fileName: "cloudSmall 2",
      size: "sm"
    },
    {
      fileName: "cloudMed 1",
      size: "md"
    },
    {
      fileName: "cloudMed 2",
      size: "md"
    },
    {
      fileName: "cloudMed 3",
      size: "md"
    },
    {
      fileName: "cloudMed 1",
      size: "md"
    },
    {
      fileName: "cloudMed 2",
      size: "md"
    },
    {
      fileName: "cloudMed 3",
      size: "md"
    },
    {
      fileName: "cloudLarge 1",
      size: "lg"
    },
    {
      fileName: "cloudLarge 2",
      size: "lg"
    },
    {
      fileName: "cloudMed 3",
      size: "lg"
    }
  ]
}
