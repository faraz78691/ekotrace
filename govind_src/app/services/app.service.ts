import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
// import {Gatekeeper} from 'gatekeeper-client-sdk';
import {environment} from 'environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoginInfo} from '@/models/loginInfo';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;
    public invalidLogin: boolean = false;
    public showLoader: boolean = true;
    public loginInfo: LoginInfo;

    constructor(
        private http: HttpClient,
        private router: Router,
        private toastr: ToastrService
    ) {}

    public loginByAuth({email, password}): Observable<LoginInfo> {
        this.loginInfo = new LoginInfo();
        const credentials = {
            username: email,
            password: password
        };
        return this.http.post<LoginInfo>(
            `${environment.baseUrl}authentic/login`,
            credentials
        );
    }
    public newloginByAuth(credentials): Observable<any> {
;

        this.loginInfo = new LoginInfo();
  
        return this.http.post<any>(
            `${environment.baseUrl}/login`,
            credentials
        );
  
        // return this.http.post<any>(
        //     `http://192.168.1.31:4003/login`,
        //     credentials
        // );
    }

    public refreshToken(tokenModel): Observable<LoginInfo> {
        this.loginInfo = new LoginInfo();
        return this.http.post<LoginInfo>(
            `${environment.baseUrl}authenticate/refresh-token`,
            tokenModel
        );
    }

    // public async registerByAuth({email, password}) {
    //     try {
    //         const token = await Gatekeeper.registerByAuth(email, password);
    //         localStorage.setItem('accessToken', token);
    //         await this.getProfile();
    //         this.router.navigate(['/']);
    //         this.toastr.success('Register success');
    //     } catch (error) {
    //         this.toastr.error(error.message);
    //     }
    // }

    // public async loginByGoogle() {
    //     try {
    //         const token = await Gatekeeper.loginByGoogle();
    //         localStorage.setItem('accessToken', token);
    //         await this.getProfile();
    //         this.router.navigate(['/']);
    //         this.toastr.success('Login success');
    //     } catch (error) {
    //         this.toastr.error(error.message);
    //     }
    // }

    // public async registerByGoogle() {
    //     try {
    //         const token = await Gatekeeper.registerByGoogle();
    //         localStorage.setItem('accessToken', token);
    //         await this.getProfile();
    //         this.router.navigate(['/']);
    //         this.toastr.success('Register success');
    //     } catch (error) {
    //         this.toastr.error(error.message);
    //     }
    // }

    // public async loginByFacebook() {
    //     try {
    //         const token = await Gatekeeper.loginByFacebook();
    //         localStorage.setItem('accessToken', token);
    //         await this.getProfile();
    //         this.router.navigate(['/']);
    //         this.toastr.success('Login success');
    //     } catch (error) {
    //         this.toastr.error(error.message);
    //     }
    // }

    // public async registerByFacebook() {
    //     try {
    //         const token = await Gatekeeper.registerByFacebook();
    //         localStorage.setItem('accessToken', token);
    //         await this.getProfile();
    //         this.router.navigate(['/']);
    //         this.toastr.success('Register success');
    //     } catch (error) {
    //         this.toastr.error(error.message);
    //     }
    // }

    // public async getProfile() {
    //     try {
    //         this.user = await Gatekeeper.getProfile();
    //     } catch (error) {
    //         this.logout();
    //         throw error;
    //     }
    // }

    public logout() {
        localStorage.clear();
        this.user = null;
        this.router.navigate(['/login']);
    }
    public getUserRole(): string {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo);
            // console.log("jsonObj",jsonObj)
            this.loginInfo = jsonObj as LoginInfo;
            // console.log("inggooo,", this.loginInfo);
            return this.loginInfo.role;
        }
    }
}
