import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import {Observable} from 'rxjs';
import {AppService} from '@services/app.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard  {
    constructor(private authService: AppService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const allowedRoles: string[] = route.data.roles; // Get the allowed roles from the route data
        const userRole = this.authService.getUserRole(); // Get the user's role from the authentication service
        if (allowedRoles.includes(userRole)) {
            // Check if the user's role is included in the allowed roles
            return true; // Allow access
        } else {
            // Redirect to a different page or show an error message
            this.router.navigate(['/unauthorized']); // Redirect to an "unauthorized" page
            return false; // Deny access
        }
    }
}

