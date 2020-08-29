import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentsService {

  readonly AIRTABLE_API_KEY = 'key6VSRSDY81TzV65';
  readonly BASE_ID = 'appNiIkUZslW09j9H';
  readonly MAX_RECORDS = 12;
  readonly headers = new HttpHeaders ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.AIRTABLE_API_KEY}`
  });

  url = `https://api.airtable.com/v0/${this.BASE_ID}/Content`;
  nextPageOffset = '';

  content: any[] = [];
  constructor(private http: HttpClient) {
    this.url += `?fields[]=Headline&fields[]=Sub-headline&fields[]=Header image&pageSize=${this.MAX_RECORDS}`;
  }

  getMoreAirtableContent(): any {

    let currUrl = this.url;
    // console.log('this.nextPageOffset', this.nextPageOffset)
    if (this.nextPageOffset) {
      currUrl += '?offset=this.nextPageOffset';
    }
    // let currUrl = this.url +
    console.log('this.url', this.url)
    return this.http.get<any>(currUrl, { headers: this.headers }).pipe(
      map(res => {
        let moreContent: any;
        console.log('res', res);
        this.nextPageOffset = res.offset;
        moreContent = res.records.map(record => {
          if (!record || !record.fields) {
            return null;
          }
          return {
            headline: record.fields.Headline,
            subHeadline: record.fields['Sub-headline'],
            image: record.fields && record.fields['Header image'] && record.fields['Header image'][0] ?
                      record.fields['Header image'][0] : null
          };
        });
        console.log('moreContent', moreContent);
        this.content = [...this.content, ...moreContent];
        console.log('this.content', this.content);
        return this.content;
      })
    );
  }
}
