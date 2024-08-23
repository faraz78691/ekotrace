import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding,
    ViewChild,
    ElementRef
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha/lib';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { LoginInfo } from '@/models/loginInfo';
import { NotificationService } from '@services/notification.service';
import { Router } from '@angular/router';
import { CompanyDetails } from '@/shared/company-details';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    protected aFormGroup: FormGroup;

    @HostBinding('class') class = 'login-box';
    loginForm!: FormGroup;
    submitted = false;
    public loginInfo: LoginInfo;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    isLoading: boolean = false;
    showLoader = false;
    isExpired: boolean;
    public isAuthLoading = false;
    @ViewChild('captchaElem')
    captchaElem!: ReCaptcha2Component;
    @ViewChild('langInput')
    langInput!: ElementRef;
    public captchaIsLoaded = false;
    public captchaSuccess = false;
    public captchaIsExpired = false;
    public captchaResponse?: string;
    public theme: 'light' | 'dark' = 'light';
    public size: 'compact' | 'normal' = 'normal';
    public lang = 'en';
    public type!: 'image' | 'audio';
    public invalidLogin: boolean = false;
    constructor(
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService,
        private fb: FormBuilder,
        private companyService: CompanyService,
        private notification: NotificationService,
        private router: Router
    ) {
        this.companyDetails = new CompanyDetails();
    }

    ngOnInit() {
        this.renderer.addClass(document.querySelector('app-root'), 'test');
        // Initialize the login form with required validators
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],

            //recaptcha: ['', Validators.required]
        });
        // Check if login information exists in local storage
        if (localStorage.getItem('LoginInfo') != null) {
            // Retrieve login information from local storage
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo);
            this.loginInfo = jsonObj as LoginInfo;
            this.getTenantsDetailById(Number(this.loginInfo.tenantID));
        }
    }
    //get tenant details by id
    getTenantsDetailById(id: number) {
        this.companyService.getTenantsDataById(id).subscribe((response) => {
            this.companyDetails = response;
        });
    }
    //logs a message to the console indicating that the reCAPTCHA verification has succeeded.
    handleSuccess(data: Event) {
        console.log('reCAPTCHA verification succeeded');
    }
    //logs a message to the console indicating that the reCAPTCHA loaded has successfully.
    handleLoad() {
        console.log('reCAPTCHA loaded successfully');
    }

    //logs a message to the console indicating that the reCAPTCHA token has expired.
    handleExpire() {
        console.log('reCAPTCHA token expired');
    }
    //logs a message to the console indicating that the reCAPTCHA has been reset.
    handleReset() {
        console.log('reCAPTCHA reset');
    }

    /* This function handles the login authentication process.
  It sends a POST request to the login endpoint with the provided username and password.
*/
    loginByAuth() {
        if (this.loginForm.valid) {
            this.submitted = true;
            this.isLoading = true;
            this.showLoader = true;
            this.isAuthLoading = true;
             const formData = new URLSearchParams();
             formData.set('email', this.loginForm.value.email.trim());
             formData.set('password', this.loginForm.value.password.trim());
            this.appService.newloginByAuth(formData).subscribe(
                (res) => {
                console.log(res);
                    if(res.success == true){

                        this.loginInfo = res.userinfo[0];
                        localStorage.setItem('accessToken', this.loginInfo.token);
                        // localStorage.setItem('accessToken', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6Ijc1ZGZjYWViMmY4ZGRlZTAyZjU2MTRmYThhMjRkMmMyIn0.eyJ1c2VyX2lkIjoidXVpZGQxMjQzMiJ9.lkY3ctvaxcV2Jx0d88b4gn5TJmka09BC3slDZpALe1IqoIWi4wWVkJzSTuIIM2dX1WZjLgcmZJguO-Neaz4sBQ');
                        
                        localStorage.setItem(
                            'LoginInfo',
                            JSON.stringify(this.loginInfo)
                        );
                        localStorage.setItem(
                            'refreshToken',
                            this.loginInfo.refreshToken
                        );
                        let userInfo = localStorage.getItem('LoginInfo');
                        let jsonObj = JSON.parse(userInfo); // string to "any" object first
                        this.loginInfo = jsonObj as LoginInfo;
                        console.log(
                            'loginInfo:',
                            this.loginInfo.role
                        );
                        this.invalidLogin = false;
                        const currentDate = new Date();
                        const licenseExpiredDate = new Date(
                            this.loginInfo.licenseExpired
                        );
                        this.isExpired = licenseExpiredDate < currentDate;
                        if (
                            this.loginInfo.role === 'Super Admin' &&
                            this.isExpired
                        ) {
                            this.router.navigate(['/billing']);
                        } else if(this.loginInfo.role === 'Platform Admin'){
                            this.router.navigate(['/platformAdmin']);
                        }
                        else {
                            this.router.navigate(['/dashboard']);
                        }
                        this.showLoader = false;
                        this.isAuthLoading = false;
                    }else{
                        this.notification.showError(
                            res.message,
                            ''
                        );
                        this.isLoading = false;
                        this.showLoader = false;
                        this.invalidLogin = true;
                    }
                },
                (err) => {
                    console.log(err);
                    if (err.error.message === 'Your license has expired.') {
                        this.toastr.error(
                            'Your plan is expired.please contact Super Admin'
                        );
                    } else {
                        this.notification.showError(
                            'Invalid username or password.',
                            ''
                        );
                    }
                    this.isLoading = false;
                    this.showLoader = false;
                    this.invalidLogin = true;
                },
                () => {
                    // 'onCompleted' callback.
                    // No errors, route to new page here
                }
            );
        } else {
            let inv = this.loginForm.invalid;
            inv === true;
            this.showLoader = false;
            this.isLoading = false;
        }
    }

    ngOnDestroy() {
        // Remove the 'login-page' class from the 'app-root' element
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
