import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  constructor(
    private http: HttpClient,
    
) { }

public getTree(url, data): Observable<any> {
  return this.http.post(environment.baseUrl + `/report/${url}`, data);
}
public getTreeList(): Observable<any> {
  return this.http.get('http://192.168.1.31:4003' + `/getAllFamilyMembers`);
};
public createTree(data): Observable<any> {
  return this.http.post('http://192.168.1.31:4003' + `/addMainTree`, data);
};
}
