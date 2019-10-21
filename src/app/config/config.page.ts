import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.initPlaceholders();
    this.configForm = new FormGroup({
      ticketValue: new FormControl([Validators.required]),
      subtractedPercent: new FormControl()
   });
  }

  handleTicketValue() {
    if (this.configForm.controls.ticketValue.value)
    this.ticketValue = Math.abs(parseInt(this.configForm.controls.ticketValue.value));
  }

  handleSubtractedPercent() {
    if (this.configForm.controls.subtractedPercent.value)
    this.subtractedPercent = Math.abs(parseInt(this.configForm.controls.subtractedPercent.value));
  }

  saveConfig() {
    this.globalService.ticketValue = this.ticketValue;
    this.globalService.subtractedPercent = this.subtractedPercent
    localStorage.setItem('ticketValue', this.ticketValue.toString() || 0);
    localStorage.setItem('subtractedPercent', this.subtractedPercent.toString() || 0);
    if (this.globalService.ticketValue != 0) {
      this.globalService.isNewApp = false;
      this.router.navigateByUrl('/home');
    }
    this.configForm.reset();
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
}
