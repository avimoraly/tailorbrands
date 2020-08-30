import { Component, Input, OnInit } from '@angular/core';
import { MAX_RECORDS_PER_PAGE } from '../services/constants';
import { ContentsService } from '../services/contents.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Input() activePage = 0;
  numberOfPages = 0;
  constructor(private contentsService: ContentsService) { }

  ngOnInit(): void {
    this.contentsService.$contents.subscribe((data) => {
      this.numberOfPages = Math.ceil(data.length / MAX_RECORDS_PER_PAGE);
    });
  }
}
