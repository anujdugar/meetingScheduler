import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'demo';
  selectedLang = 'English';


  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');
    this.toggleLang('en');

  }
  ngOnInit() {

  }
  changeLang(lang) {
    this.translate.use(lang);
  }
  toggleLang(updatedLang) {
    this.selectedLang = (updatedLang === 'en') ? 'English' : 'हिन्दी';
    this.changeLang(updatedLang);
  }


}
