import { AIRTABLE_API_KEY, BASE_ID, MAX_RECORDS, MAX_RECORDS_PER_PAGE } from './constants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { from } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentsService {
  finish = false;
  firstLoad = true;
  $contents: BehaviorSubject <any[]> = new BehaviorSubject([]);
  subContents: Subscription = null;
  readonly headers = new HttpHeaders ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AIRTABLE_API_KEY}`
  });

  url = `https://api.airtable.com/v0/${BASE_ID}/Content`;
  nextPageOffset = null;

  content: any[] = [];

  constructor(private http: HttpClient) {
    this.url += `?fields[]=Headline&fields[]=Sub-headline&fields[]=Header%20image&pageSize=${MAX_RECORDS}`;
  }

  loadRecordForPage(page: number): void {
    this.subContents = this.$contents.subscribe(data => {
      console.log("subContents", data.length, page * MAX_RECORDS_PER_PAGE)
      if (data.length  <= page * (MAX_RECORDS_PER_PAGE)+ MAX_RECORDS ) {
        this.getMoreAirtableContent();
      } else {
        if (this.subContents) {
          this.subContents.unsubscribe();
        }
      }
    });
  }

  getMoreAirtableContent(): any {
    let currUrl = this.url;
    console.log('getMoreAirtableContent')
    if (this.nextPageOffset && this.nextPageOffset !== 'finish') {
      currUrl += `&offset=${this.nextPageOffset}`;
    }

    if (this.nextPageOffset === 'finish') {
      return;
    }
console.log('currUrl', currUrl)
    this.http.get<any>(currUrl, { headers: this.headers }).subscribe(res => {
        let moreContent: any;
        this.nextPageOffset = res.offset || 'finish';
        moreContent = res.records.map(record => {
          if (!record || !record.fields ) {
            return [];
          }
          return {
            headline: record.fields.Headline,
            subHeadline: record.fields['Sub-headline'],
            image: record.fields && record.fields['Header image'] && record.fields['Header image'][0] ?
                      record.fields['Header image'][0] : null
          };
        });
        this.content = [...this.content, ...moreContent];
        console.log('this.content', this.content);
        this.$contents.next(this.content);
    });
  }
}
