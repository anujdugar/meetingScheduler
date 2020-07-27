import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit {
  events: any;
  newZone = 'America/Toronto';
  timeZones;
  showList = true;
  constructor(private cryptoService: CryptoService, private cd: ChangeDetectorRef) {
    this.cryptoService.notify.subscribe(
      data => {
        if (data) {
          this.updateTimeZone();
        }
      });
  }

  ngOnInit(): void {
    this.timeZones = moment.tz.names();
    this.events = [];
    const a = this.cryptoService.list;
    if (this.cryptoService.list) {
      this.events = JSON.parse(this.cryptoService.list);
    }
    //  this.updateTimeZone();
  }

  updateTimeZone() {
    const that = this;
    this.showList = false;
    this.events = [];
    const eventList = JSON.parse(this.cryptoService.list);
    eventList.forEach(el => {
      el.startTime = new Date(el.startTime);
      el.startTime = el.startTime.toLocaleString('en-US', { timeZone: this.newZone });
      el.endTime = new Date(el.endTime);
      el.endTime = el.endTime.toLocaleString('en-US', { timeZone: this.newZone });

    });
    this.events = [...eventList];
    console.log(this.events);
    that.showList = true;
    that.cd.detectChanges();



  }
}
