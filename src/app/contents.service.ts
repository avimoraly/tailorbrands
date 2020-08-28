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

  constructor(private http: HttpClient) {

  }

  getMoreAirtableContent(): any {
    // this.url += `?api_key=${this.AIRTABLE_API_KEY}`;
    this.url += `?fields[]=Headline&fields[]=Sub-headline&fields[]=Header image&pageSize=${this.MAX_RECORDS}`;

    return this.http.get<any>(this.url, { headers: this.headers }).pipe(
      map(res => {

      })
    );
  }
}
