import { ContentsService } from './contents.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tailor-brands';
  gotError = false;
  contents = [];
  constructor(private contentsService: ContentsService) {
    this.contentsService.getMoreAirtableContent().subscribe(
      res => {
        this.contents = res;
        console.log('res', res);
      },
      e => {
        this.gotError = true;
        console.error('err', e);
      }
    );
  }
}
