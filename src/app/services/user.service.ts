import {HttpClient, HttpParams} from '@angular/common/http';
import {UserInfo, newUserInfo} from '@/models/UserInfo';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {userInfo} from 'os';
import {environment} from 'environments/environment';
import {ResetPassword} from '@modules/reset-password/reset-password';
import {ForgotPassword} from '@modules/forgot-password/forgot-password';
import {RoleModel, newRoleModel} from '@/models/Roles';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // apiURL = environment.baseUrl + 'Authenticate/';
    apiURL = environment.baseUrl;
    localapiURL = 'http://192.168.1.31:4003';
    checkuserURL = environment.baseUrl + 'Authenticate/check/';
    constructor(private http: HttpClient) {}

    forgotPassword(email: string) {
        let urlUser = this.apiURL + 'sendmail?EmailId=' + email;
        return this.http.post(urlUser, String);
    }

    reSetPassword(resetData: ResetPassword) {
        let json = {
            userid: resetData.userid,
            newPassword: resetData.newpassword
        };
        // Replace this URL with your API endpoint
        return this.http.put(this.apiURL + 'update-password', json);
    }

    public SaveUsers(admininfo) {
        return this.http.post<UserInfo[]>(this.apiURL + 'register', admininfo);
    };
    public newSaveUsers(admininfo) {
        return this.http.post<newUserInfo[]>(this.localapiURL + '/register', admininfo);
    };

    public getUsers(tenantId) {
        return this.http.get<UserInfo[]>(this.apiURL + 'user/' + tenantId);
    }
    public newgetUsers(tenantId) {
        return this.http.post<UserInfo[]>('http://192.168.1.31:4003/getAllusers', tenantId);
    };
    public UpdateUsers(admininfo) {
        return this.http.put<UserInfo[]>(this.apiURL + admininfo.id, admininfo);
    }
    public deleteUsers(userid) {
        return this.http.delete(this.apiURL + userid);
    }
    public GetAllRoles(): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(this.apiURL + 'role-all');
    }
    public newGetAllRoles(): Observable<any[]> {
        return this.http.get<any[]>(this.localapiURL + '/getAllroles');
    }
    public CheckUserExist(username) {
        return this.http.get<boolean>(this.checkuserURL + username);
    }
    public getPackageDetails() {
        return this.http.get<boolean>('http//192.168.1.31:4003/getpackages');
    }
    public getNewPackageDetails() {
        return this.http.get('http://192.168.1.31:4003/getpackages');
    }
    public getBillingUsers(data) {
        return this.http.post('http://192.168.1.31:4003/getAllusers', data);
    }

    public newSavepackages(packagedetails): Observable<any> {
        return this.http.post('http://192.168.1.31:4003' + '/addpackage', packagedetails);
    }
}
