import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { IndustryType } from './industry-type';
import { CompanyDetails } from '@/shared/company-details';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyService } from '@services/company.service';
import { NgForm } from '@angular/forms';
import { RegistrationService } from '@services/registration.service';
import { NotificationService } from '@services/notification.service';
import { MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

import { ThemeService } from '@services/theme.service';
import { countries } from '@/store/countrieslist';

@Component({
    selector: 'app-company-profile',
    templateUrl: './company-profile.component.html',
    styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent {
    countries: any;
    public loginInfo: LoginInfo;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    industryTypes: IndustryType[];
    selectedSecondaryIndustryTypes: IndustryType[];
    selectedIndustryTypes: IndustryType[];
    uploadedFile: any[] = [];
    companyProfile: any[] = [];
    rootUrl: string;
    updatedtheme: string;
    multiselectcolor: any;
    selectedFile: File;
    uploadedImageUrl: string | ArrayBuffer | null = null;
    companyName: string;
    constructor(
        private companyService: CompanyService,
        public registrationService: RegistrationService,
        private toastr: ToastrService,
        private notification: NotificationService,
        private messageService: MessageService,
        private themeservice: ThemeService
    ) {
        this.countries = countries;

        this.loginInfo = new LoginInfo();
        this.companyDetails = new CompanyDetails();
        this.rootUrl = environment.baseUrl + 'uploads/';
    }
    ngOnInit() {
        //creating Array for industry type
      
        //Retrieves the user login information from local storage and assigns it to the loginInfo variable.
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo);
            this.loginInfo = jsonObj as LoginInfo;
        }
        this.getTenantsDetailById(Number(this.loginInfo.tenantID));
        this.getCompanyCategory();
    };
    //method to get tenants details by id
    getTenantsDetailById(id: number) {

        const formdata = new URLSearchParams();
        formdata.set('tenant_id', this.loginInfo.tenantID.toString())
        this.companyService.newgetTenantsDataById(formdata.toString()).subscribe((response) => {
            this.companyDetails = response.categories[0];
            this.uploadedImageUrl = this.companyDetails.logoPath;

            // this.uploadedImageUrl =
            //     this.rootUrl +
            //     (response.logoName === '' || response.logoName === null
            //         ? 'defaultimg.png'
            //         : response.logoName);

            localStorage.setItem('companyName', response.companyName);
            this.selectedSecondaryIndustryTypes = JSON.parse(
                this.companyDetails.secondIndustryTypeID
            ) as IndustryType[];
            this.selectedIndustryTypes = JSON.parse(
                this.companyDetails.industryTypeID
            ) as IndustryType[];
        });
    }
    //triggered whenever a change detection cycle runs 
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
        this.loginInfo.companyName = localStorage.getItem('companyName');
    }
    //method to update company profile
    saveChanges() {
        console.log(this.selectedIndustryTypes);
        const stringifySelectedIndustryTypes = JSON.stringify(this.selectedIndustryTypes);
        const stringifySelectedSecondaryIndustryTypes = JSON.stringify(this.selectedSecondaryIndustryTypes);

        const formData: FormData = new FormData();
        if (this.selectedFile) {
            formData.append('file', this.selectedFile, this.selectedFile.name);
        }
        formData.append('companyName', this.companyDetails.companyName);
        formData.append('industryTypeID', stringifySelectedIndustryTypes);
        formData.append('secondIndustryTypeID', stringifySelectedSecondaryIndustryTypes);
        formData.append('tenant_id', this.loginInfo.tenantID.toString());
        formData.append('location', this.companyDetails.location);
        formData.append('companyBio', this.companyDetails.companyBio);
        // this.companyDetails.industryTypeID = JSON.stringify(
        //     this.selectedIndustryTypes
        // );
        // this.companyDetails.secondIndustryTypeID = JSON.stringify(
        //     this.selectedSecondaryIndustryTypes
        // );
        this.registrationService.updateCompany(formData).subscribe({
            next: (response) => {
                // this.getTenantsDetailById(Number(this.loginInfo.tenantID));
                this.notification.showSuccess(
                    'Profile Updated successfully',
                    'Success'
                );
            }
        });
    }
    //method for upload company-logo
    uploadImage(files: FileList | null) {
        if (files && files.length > 0) {
            this.selectedFile = files[0];

            const formData: FormData = new FormData();
            formData.append('file', this.selectedFile, this.selectedFile.name);
            if (formData.has('file')) {
                // File is available in the FormData
                console.log('File exists in the FormData.');
            } else {
                // File is not available in the FormData
                console.log('File does not exist in the FormData.');
            }
            let tenantId = this.loginInfo.tenantID;
            this.companyService
                .UploadComapnyLogo(formData, tenantId)
                .subscribe({
                    next: (response) => {
                        if (response) {
                            //this.toastr.success('File uploaded successfully', 'Success', { timeOut: 3000 });
                            this.toastr.success('File uploaded successfully');
                            this.uploadedImageUrl =
                                this.rootUrl + this.selectedFile.name;
                            this.companyDetails.logoName =
                                this.selectedFile.name;
                            this.companyDetails.logoPath =
                                this.uploadedImageUrl;
                            localStorage.setItem(
                                'uploadedImageUrl',
                                this.uploadedImageUrl
                            );
                        } else {
                            // Handle the case when the file upload was not successful
                            this.toastr.error('Image upload failed');
                        }
                    },
                    error: (err) => {
                        if (
                            err.error.message ===
                            'File size exceeds the allowed limit'
                        ) {
                            this.notification.showError(
                                'File is too large to upload',
                                ''
                            );
                        } else if (
                            err.error.message ===
                            'Only PNG and JPG files are allowed'
                        ) {
                            this.notification.showError(
                                'Only PNG and JPG files are allowed',
                                ''
                            );
                        } else {
                            // Handle other errors
                            console.error('errrrr', err);
                            this.toastr.error('Image upload failed');
                        }
                        // Handle the error
                        console.log('Error-->>: ', JSON.stringify(err));
                        //this.toastr.error('Image uploadd failed');
                    }
                });
        }
    }
    //triggered when a file is selected from the file input
    onFileSelected(event) {
        // const file = files.item(0);
        this.selectedFile = event.target.files[0];
        if (this.selectedFile) {
            this.loadSelectedImage()

        }
    }
    loadSelectedImage() {
        const reader = new FileReader();
        reader.onload = (event) => {
            this.uploadedImageUrl = event.target?.result;
        };
        reader.readAsDataURL(this.selectedFile);
    };

    onIndustryTypeChange(category) {
        const industryMethod = category.value;
        this.getCompanySubCategory(industryMethod);
    }


    getCompanyCategory() {

        this.companyService.newgetComapnyProfile().subscribe((response) => {
            console.log(response);
            this.companyProfile = response.categories;
            this.getCompanySubCategory(this.companyProfile[0].category)
        });
    }
    getCompanySubCategory(type) {
        const formDara = new URLSearchParams()
        formDara.set('category', type)
        this.companyService.newgetSubComapny(formDara.toString()).subscribe((response) => {
            this.industryTypes = response.categories;
            console.log(this.industryTypes);

        });
    }
}
