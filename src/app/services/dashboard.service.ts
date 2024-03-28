import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Location } from '@/models/Location';
import {
    DashboardModel,
    TopCarbonConsumingByMonthModel,
    TopCarbonConsumingModel
} from '@/models/Dashboard';
@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    apiURL = environment.baseUrl;
    localapiURL = 'http://192.168.1.31:4003';
    constructor(private http: HttpClient) { }

    public GetDataForEnvironment(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForEnvironment/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForEnvironment(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForEnvironment/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForEnvironment(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForEnvironment/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    // StationaryCombustion

    public GetDataForStationaryCombustion(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForStationaryCombustion/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }

    public GetTopCarbonConsumingForStationaryCombustion(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForStationaryCombustion/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForStationaryCombustion(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForStationaryCombustion/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    // Refrigerants
    public GetDataForRefrigerants(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForRefrigerants/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForRefrigerants(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForRefrigerants/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForRefrigerants(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForRefrigerants/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    //fire Extinguisher
    public GetDataForFireExtinguishers(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForFireExtinguishers/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }

    public GetTopCarbonConsumingForFireExtinguishers(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForaFireExtinguishers/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForFireExtinguishers(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForFireExtinguishers/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    //vehicle
    public GetDataForVehicles(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForVehicles/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForVehicles(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForVehicles/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForVehicles(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForVehicles/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    //Electricity
    public GetDataForElectricity(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForElectricity/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForElectricity(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForElectricity/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForElectricity(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForElectricity/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    //Heat n Steam
    public GetDataForHeatnSteam(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForHeatnSteam/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForHeatnSteam(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForHeatandSteam/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForHeatnSteam(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForHeatandSteam/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    };

    public getdashboardfacilities(admininfo) {
        return this.http.post(this.localapiURL + '/getdashboardfacilities', admininfo);
    };
    public GScopeWiseEimssion(admininfo) {
        return this.http.post(this.localapiURL + '/dashboardScope', admininfo);
    };
    public GTopWiseEimssion(admininfo) {
        return this.http.post(this.localapiURL + '/dashboardTopEmssion', admininfo);
    };
    public GemissionActivity(admininfo) {
        return this.http.post(this.localapiURL + '/dashboardEmssionByactivities', admininfo);
    };
    public GVEndorActivity(admininfo) {
        return this.http.post(this.localapiURL + '/dashboardEmssionByVendors', admininfo);
    };
    public getScopeDonutsER(admininfo) {
        return this.http.post(this.localapiURL + '/ScopewiseEmssion', admininfo);
    };

}
