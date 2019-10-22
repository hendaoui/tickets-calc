import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  public homeForm;
  public activePercent = true;
  public ticketsNumber: number = 0;
  public rest: string = '0';
  @ViewChild('input', null) myInput;
  constructor(
    private router: Router,
    public globalService: GlobalService,
    private ngZone: NgZone,
    private keyboard: Keyboard
  ) { }

  ngOnInit() {
    this.homeForm = new FormGroup({
      amount: new FormControl([Validators.required]),
    });
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.myInput.setFocus();
      this.keyboard.show();
    },150);
 }

  prepareCalculation(amount?) {
    if (amount) {
      this.doCalculation(amount);
    } else {
      this.homeForm.controls['amount'].valueChanges.subscribe(
        (selectedValue) => {
          if (!selectedValue) {
            this.rest = '0';
            this.ticketsNumber = 0;
          } else {
            this.doCalculation(selectedValue);
          }
        });
    }
  }

  doCalculation(amount) {
    let availableAmount = this.getAvailableAmount();
    if (amount >= availableAmount && availableAmount > 0) {
      let _rest = amount / availableAmount;
      if (_rest >= 1) {
        this.ticketsNumber = parseInt(_rest.toString().includes('.') ? _rest.toString().split(".")[0] : _rest.toString());
        if (_rest > 1) {
          let restAmount = amount - (this.ticketsNumber * availableAmount)
          this.rest = (restAmount < 1000 ? restAmount / 1000 : restAmount).toString();
        } else {
          this.rest = '0';
        }
      }
    } else if (availableAmount === 0) {
      this.ticketsNumber = 1
      this.rest = (amount < 1000 ? amount / 1000 : amount).toString();
    } else {
      this.ticketsNumber = 0;
      this.rest = '0';
    }
  }

  getAvailableAmount() {
    let ticketValue: number = parseInt(this.globalService.ticketValue.toString());
    let subtractedPercent: number = parseInt(this.globalService.subtractedPercent.toString());
    return this.activePercent ? ticketValue - (ticketValue * (subtractedPercent / 100)) : ticketValue;
  }

  togglePercent() {
    this.ngZone.run(() => {
      this.activePercent = !this.activePercent;
      this.prepareCalculation(this.homeForm.controls['amount'].value);
    })
  }

  openConfig() {
    this.homeForm.reset();
    this.router.navigateByUrl('/config');
  }
}
