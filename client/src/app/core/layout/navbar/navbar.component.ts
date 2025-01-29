import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminloginService } from '../../service/auth/adminlogin.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private adminLoginService = inject(AdminloginService)
  private router = inject(Router)



  adminLogOut() {
    this.adminLoginService.adminLoggedOut();
    this.router.navigate(['/admin-login']);
  }

}
