import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { AIRTABLE_API_KEY, BASE_ID, MAX_RECORDS, MAX_RECORDS_PER_PAGE } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ContentsService {
  pending = false;
  finish = false;
  firstLoad = true;
  $contents: BehaviorSubject <any[]> = new BehaviorSubject([]);
  $error: Subject<any> = new Subject();
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
    if (this.pending) {
      return;
    }
    let currUrl = this.url;
    if (this.nextPageOffset && this.nextPageOffset !== 'finish') {
      currUrl += `&offset=${this.nextPageOffset}`;
    }

    if (this.nextPageOffset === 'finish') {
      return;
    }

    this.pending = true;
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
        this.$contents.next(this.content);
        this.pending = false;
    }, error => {
      console.log('error', error)
      this.pending = false;
      this.$error.next(error);
    });
  }
}
