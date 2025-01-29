import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { OpenaiService } from '../../../core/service/openai/openai.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  

}
