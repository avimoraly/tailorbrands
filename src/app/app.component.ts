import { ContentsService } from './services/contents.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { MAX_RECORDS_PER_PAGE } from './services/constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  activePage = 0;
  subContents: Subscription = null;
  isMobile: boolean;
  constructor(private contentsService: ContentsService, private route: ActivatedRoute) {
    this.getScreenSize();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(): void {
      if (window.innerWidth < 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
  }




@HostListener('window:scroll') onScrollHost(e: Event): void {
  console.log(window.scrollY , document.body.scrollHeight);
  if (window.scrollY / document.body.scrollHeight > 0.9 && this.contentsService.nextPageOffset !== 'finish') {
    this.contentsService.getMoreAirtableContent();
  }
}


ngOnInit(): void {
    this.route.queryParams.pipe(debounceTime(200)).subscribe(params => {
      const page = (params.page) ? params.page : 0;
      this.contentsService.loadRecordForPage(page);
      this.contentsService.$contents.subscribe(data => {
        if (page * MAX_RECORDS_PER_PAGE < data.length) {
          this.activePage = +page;
        }
        if (this.contentsService.nextPageOffset === 'finish' ) {
          if (this.subContents) {
            this.subContents.unsubscribe();
          }
        }
      });
    });
  }
}
