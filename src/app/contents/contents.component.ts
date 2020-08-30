import { Component, OnInit } from '@angular/core';
import { ContentsService } from '../services/contents.service';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.css']
})
export class ContentsComponent implements OnInit {

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

  ngOnInit(): void {
  }

}
