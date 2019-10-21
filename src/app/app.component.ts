import { Component, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalService } from './global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private globalService: GlobalService,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.isNewApp();
      if (this.globalService.isNewApp) {
        this.ngZone.run(() => {
          if (this.globalService.isNewApp) {
            this.router.navigateByUrl('/config');
          }
        })
      }
    });
  }

  isNewApp() {
    this.ngZone.run(() => {
      this.globalService.ticketValue = parseInt(localStorage.getItem('ticketValue')) || 0;
      this.globalService.subtractedPercent = parseInt(localStorage.getItem('subtractedPercent')) || 0;
      this.globalService.isNewApp = this.globalService.ticketValue === 0;
    });
  }
}
