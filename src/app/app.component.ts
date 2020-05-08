import { Component, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalService } from './global.service';
import { Router } from '@angular/router';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html',
})
export class AppComponent {

  bannerConfig: AdMobFreeBannerConfig = {
    isTesting: false,
    autoShow: true,
    id: "ca-app-pub-6579994688783551/8460786946",
    bannerAtTop: false
  };

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    public globalService: GlobalService,
    private ngZone: NgZone,
    private router: Router,
    private admobFree: AdMobFree
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByName('white');
      this.statusBar.styleDefault();
      this.isNewApp();
      if (this.globalService.isNewApp) {
        this.router.navigateByUrl('/config');
      } else {
        this.router.navigateByUrl('/home');
      }
      // adMob
      this.setUpAdMob();
      this.platform.backButton.subscribeWithPriority(0, () => {
        if (this.router.url === '/home') {
          navigator['app'].exitApp();
        } else {
          if (this.globalService.isNewApp) {
            navigator['app'].exitApp();
          } else {
            this.router.navigateByUrl('/home');
          }
        }
      });
    });
  }

  isNewApp() {
    this.ngZone.run(() => {
      this.globalService.ticketValue = parseInt(localStorage.getItem('ticketValue')) || 0;
      this.globalService.subtractedPercent = parseInt(localStorage.getItem('subtractedPercent')) || 0;
      this.globalService.isNewApp = this.globalService.ticketValue === 0;
      setTimeout(() => {
        this.globalService.isLoading = false;
      }, 1000)
    });
  }

  setUpAdMob() {
    this.admobFree.banner.config(this.bannerConfig);
    this.admobFree.banner.prepare()
      .then(() => console.log())
      .catch((e) => console.error(e));
  }
}
