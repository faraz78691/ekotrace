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
public getTreeById(id): Observable<any> {
  return this.http.post(environment.baseUrl + `/allTreedata`, id);
}
public getTreeList(): Observable<any> {
  return this.http.get(environment.baseUrl + `/getAllFamilyMembers`);
};
public createTree(data): Observable<any> {
  return this.http.post(environment.baseUrl + `/addMainTree`, data);
};

public createChildTree(data): Observable<any> {
  return this.http.post(environment.baseUrl + `/addChildInTree`, data);
};
public deleteChildTree(data): Observable<any> {
  return this.http.post(environment.baseUrl + `/deleteNode`, data);
};
}
