import { Component, OnInit, Input } from '@angular/core';
import { ContentsService } from '../services/contents.service';
import { MAX_RECORDS_PER_PAGE } from '../services/constants';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.css']
})
export class ContentsComponent implements OnInit {
  @Input() activePage = 0;
  numberOfRecoredInPage = MAX_RECORDS_PER_PAGE;
  gotError = false;
  loading = true;
  contents = [];

  constructor(private contentsService: ContentsService) {
    this.contentsService.$contents.subscribe(contents => {
      this.contents = contents;
    });
  }

  ngOnInit(): void {
  }

}
