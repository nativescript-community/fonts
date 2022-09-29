import { Component, NgZone } from '@angular/core';
import { DemoSharedFonts } from '@demo/shared';
import {} from '@nativescript-community/fonts';

@Component({
  selector: 'demo-fonts',
  templateUrl: 'fonts.component.html',
})
export class FontsComponent {
  demoShared: DemoSharedFonts;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedFonts();
  }
}
