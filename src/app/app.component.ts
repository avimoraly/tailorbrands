import { ContentsService } from './services/contents.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tailor-brands';
  gotError = false;
  loading = true;
  contents = [];
  constructor(private contentsService: ContentsService) {
    this.contentsService.getMoreAirtableContent().subscribe(
      res => {
        this.contents = res;
        console.log('contents', this.contents);
      },
      e => {
        this.gotError = true;
        console.error('err', e);
      }
    );
  }
}
