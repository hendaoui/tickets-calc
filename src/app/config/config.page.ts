import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
})
export class ConfigPage implements OnInit {
  public configForm;
  public ticketValue;
  public subtractedPercent;
  constructor(
    public globalService: GlobalService,
    private router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.initPlaceholders();
    this.configForm = new FormGroup({
      ticketValue: new FormControl([Validators.required]),
      subtractedPercent: new FormControl(this.globalService.subtractedPercent || null, )
   });
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.configForm.setValue({
        ticketValue: this.globalService.ticketValue || null,
        subtractedPercent: this.globalService.subtractedPercent || null
      })
    },150);
 }

  handleTicketValue() {
    if (this.configForm.controls.ticketValue.value)
    this.ticketValue = Math.abs(parseInt(this.configForm.controls.ticketValue.value) || 0);
  }

  handleSubtractedPercent() {
    this.subtractedPercent = Math.abs(parseInt(this.configForm.controls.subtractedPercent.value) || 0);
  }

  saveConfig() {
    this.globalService.ticketValue = this.ticketValue;
    this.globalService.subtractedPercent = this.subtractedPercent;
    if (parseInt(this.subtractedPercent.toString()) > 100) {
      this.globalService.subtractedPercent = 100;
      this.subtractedPercent = 100;
    }
    localStorage.setItem('ticketValue', this.ticketValue.toString() || 0);
    localStorage.setItem('subtractedPercent', this.subtractedPercent.toString() || 0);
    if (this.globalService.ticketValue != 0) {
      this.globalService.isNewApp = false;
      this.router.navigateByUrl('/home');
    }
  }

  openHome() {
    this.configForm.reset();
    this.initPlaceholders();
    this.router.navigateByUrl('/home');
  }

  initPlaceholders() {
    this.ticketValue = this.globalService.ticketValue;
    this.subtractedPercent = this.globalService.subtractedPercent;
  }

  async showInfo() {
    const toast = await this.toastController.create({
      message: 'Developed with ❤ by henihendaoui@gmail.com',
      mode: 'ios',
      duration: 2000,
      color: 'dark',
      cssClass: 'c-toast'
    });
    toast.present();
  }
}
