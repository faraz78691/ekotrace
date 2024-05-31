import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {CompanyDetails} from '@/shared/company-details';
import {v4 as uuidv4} from 'uuid';
import {CountryCode} from '@/models/CountryCode';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    rootUrl: string;
    constructor(private http: HttpClient) {
        this.rootUrl = environment.baseUrl + 'Tenants/';
    }
    getCompaniesList(): Observable<CompanyDetails[]> {
        return this.http.get<CompanyDetails[]>(this.rootUrl);
    }

    public getTenantsDataById(id: number): Observable<CompanyDetails> {
        return this.http.get<CompanyDetails>(
            environment.baseUrl + '/getFacilityByTenantId/' + id
        );
    };
    public newgetTenantsDataById(id: string): Observable<CompanyDetails> {
        return this.http.post<CompanyDetails>(
            environment.baseUrl +  '/getComapnyDetail', id
        );
    };
    public setHazardNonhazard(data: any): Observable<CompanyDetails> {
        return this.http.post<CompanyDetails>(
            '/http://192.168.1.28:4005/addHazardous_nonhazardous', data
        );
    };
    public newgetComapnyProfile(): Observable<any> {
        return this.http.get(
            environment.baseUrl +  '/getComapnyCategory'
        );
    };
    public newgetSubComapny(data): Observable<any> {
        return this.http.post(
            environment.baseUrl +  '/getComapnySubCategory' , data
        );
    };
    getWasteType(): Observable<any> {
        return this.http.get(environment.baseUrl + '/getendoflife_waste_type')
    };
    getYEarType(): Observable<any> {
        return this.http.post(environment.baseUrl + '/getfinancial_year','')
    };
    sendmailForPlanRenewal() {
        let url = this.rootUrl + 'sendplanrenewalmail';
        return this.http.post(url, String);
    };

    UploadComapnyLogo(formData: FormData, tenantId: number): Observable<any> {
        const url = `${this.rootUrl}UploadLogo?id=${tenantId}`;
        return this.http.post<any>(url, formData);
    };

    public GetCountryCode(): Observable<CountryCode[]> {
        return this.http.get<CountryCode[]>(
            environment.baseUrl + 'Facilities/Country'
        );
    }
}
