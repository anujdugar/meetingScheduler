import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  key = 'secret';
  private flag = new Subject<boolean>();
  notify = this.flag.asObservable();

  constructor() { }

  saveData(data: any) {
    let listData = [];
    if (this.list && this.list !== '') {
      const eventList = JSON.parse(this.list);
      eventList.push(data);
      listData = eventList;
    } else {
      listData.push(data);
    }
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(listData), this.key.trim());
    localStorage.setItem('list', encryptedData);
    this.flag.next(true);
  }

  public get list() {
    let list;
    list = localStorage.getItem('list');
    return list && list !== '' ? CryptoJS.AES.decrypt(list, this.key.trim()).toString(CryptoJS.enc.Utf8) : '';
  }
}
