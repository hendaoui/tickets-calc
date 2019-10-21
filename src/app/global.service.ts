import { Injectable } from '@angular/core';
import { HomePage } from './home/home.page'
import { ConfigPage } from './config/config.page'

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  ticketValue: number;
  subtractedPercent: number;
  isNewApp: boolean;
  constructor() {
    this.isNewApp = localStorage.getItem('ticketValue') != '0';
  }
}
