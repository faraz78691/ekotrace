import {Group} from '@/models/group';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {Location} from '@/models/Location';
@Injectable({
    providedIn: 'root'
})
export class GroupService {
    constructor(private http: HttpClient) {}

    public GetGroups(tenantID): Observable<Group[]> {
        return this.http.get<Group[]>(
            environment.baseUrl + 'Group/GetGroups/' + tenantID
        );
    }
    public newGetGroups(tenantID:any): Observable<any> {
        console.log("service called")
        return this.http.post(
            environment.baseUrl + '/getGroups',tenantID
        );
    }
    public getuser_offseting(tenantID:any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/getuser_offseting',tenantID
        );
    };
    public getTargetSetting(): Observable<any> {
        return this.http.get(
            environment.baseUrl + '/targetsetting/getTargetSettingDetails'
        );
    };

    public EditGroup( groupdetails): Observable<any> {
        return this.http.post(environment.baseUrl + '/Updategroupmapping' , groupdetails);
    }
    public newEditGroup( groupdetails) {
        return this.http.post(environment.baseUrl + '/Updategroupmapping' , groupdetails);
    };
    public newUpdatePackage( packageDetails) {
        return this.http.post(environment.baseUrl + '/Updategroupmapping' , packageDetails);
    }

    public SaveGroups(groupdetails): Observable<any> {
        return this.http.post(environment.baseUrl + 'Group/', groupdetails);
    };
    public newSaveGroups(groupdetails): Observable<any> {
        return this.http.post(environment.baseUrl + '/Addgroup', groupdetails);
    }
    public Adduser_offseting(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/Adduser_offseting', groupdetails);
    }
    public addTargetSetting(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/targetsetting/addTargetSetting', groupdetails);
    }

    public deleteGroups(id) {
        return this.http.delete(environment.baseUrl + 'Group/' + id);
    }
    public newdeleteGroups(id) {
        return this.http.post(environment.baseUrl + '/removeGroup' , id);
    }

    public CheckGroupExist(id) {
        return this.http.get<boolean>(
            environment.baseUrl + 'Group/GroupExists/' + id
        );
    }
    public GetCountry(): Observable<Location[]> {
        return this.http.get<Location[]>(environment.baseUrl + 'Group/Country');
    }
    public GetState(id): Observable<Location[]> {
        return this.http.get<Location[]>(
            environment.baseUrl + 'Group/State/' + id
        );
    }
}
