import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(private http: Http) { }

  fetchData() {
    //console.log('fetchData');
    return this.http.get('/api/tasks').map(this.extractData);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
  }
}
