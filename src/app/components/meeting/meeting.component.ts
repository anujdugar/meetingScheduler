import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment-timezone';
import { CryptoService } from 'src/app/services/crypto.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {
  @Input() list;
  eventForm;
  timeZones;
  currentDate;
  eventList;

  constructor(private fb: FormBuilder, private cryptoService: CryptoService) {

  }

  ngOnInit() {
    const nameFormat = "^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$";
    this.currentDate = new Date();
    console.log(this.currentDate);
    this.eventForm = this.fb.group({
      firstName: new FormControl('', [Validators.required, Validators.pattern(nameFormat)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(nameFormat)]),
      date: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),

    });
    if (this.cryptoService.list) {
      this.eventList = JSON.parse(this.cryptoService.list);
      console.log(this.eventList);
    }

  }
  submitForm() {
    if (this.compareTime()) {
      if (this.checkOverlap()) {
        const startTime = this.eventForm.value.date + ' ' + this.eventForm.value.startTime;
        this.eventForm.value.startTime = new Date(startTime);
        this.eventForm.value.startTime.toISOString();
        this.eventForm.value.startTime.valueOf();

        const endTime = this.eventForm.value.date + ' ' + this.eventForm.value.endTime;
        this.eventForm.value.endTime = new Date(endTime);
        this.eventForm.value.endTime.toISOString();
        this.eventForm.value.endTime.valueOf();

        this.cryptoService.saveData(this.eventForm.value);
        this.list.updateTimeZone();
        this.eventForm.reset();
      }

    } else {
      alert('End time should always be greater than start time');
    }
    console.log(this.eventForm.value);
  }
  compareTime() {
    const startTime = this.eventForm.value['startTime'].split(':');
    const endTime = this.eventForm.value['endTime'].split(':');
    if ((parseInt(startTime[0]) < parseInt(endTime[0])) ||
      ((parseInt(startTime[0]) === parseInt(endTime[0])) && (parseInt(startTime[1]) < parseInt(endTime[1])))) {
      return true;

    } else {
      return false;

    }


  }
  checkOverlap() {
    let validDate = true;
    let startTime = this.eventForm.value['startTime'];
    startTime = this.eventForm.value.date + ' ' + startTime;
    startTime = new Date(startTime);
    let endTime = this.eventForm.value['endTime'];
    endTime = this.eventForm.value.date + ' ' + endTime;
    endTime = new Date(endTime);
    if (this.eventList && this.eventList.length > 0) {
      for (let i = 0; i < this.eventList.length; i++) {
        const sTime = new Date(this.eventList[i].startTime);
        const eTime = new Date(this.eventList[i].endTime);
        if ((startTime.getTime() > sTime.getTime() && startTime.getTime() < eTime.getTime()) ||
          (endTime.getTime() > sTime.getTime() && endTime.getTime() < eTime.getTime())) {
          validDate = false;
          alert('A meeting is already scheduled for the given time range.Kindly select a different time range.');
          break;
        }

      }
    }
    return validDate;

  }

}
