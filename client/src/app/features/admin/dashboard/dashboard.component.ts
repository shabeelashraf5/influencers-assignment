import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { OpenaiService } from '../../../core/service/openai/openai.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/service/dashboard/dashboard.service';
import { Influencers } from '../../../models/influencers.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  userDetails: any[] = []
  name: string = ""
  showModal: boolean = false;
  deleteId: string | null = null;
  selectedUserId: string | null = null; 
  message: string = '';


  dashboardService = inject(DashboardService)

  ngOnInit() {

    this.displayInfluencers()
    
  }


  displayInfluencers() {

    this.dashboardService.displayUserDetails().subscribe({
      next: (response) => {

        this.userDetails = response.users
        console.log(this.userDetails)

      }

    })
  }

  addInfluencers() {
    const listData: Influencers = {
      
      name: this.name,
    };
    this.dashboardService.addInfluencers(listData).subscribe({
      next: (response) => {
        this.displayInfluencers()
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteTask(id: string) {
    this.dashboardService.deletelist(id).subscribe({
      next: (response) => {
        this.displayInfluencers();
        console.log('Deleted:', response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  openModal(id: string) {
    console.log("Opening modal for user with ID:", id);
    this.deleteId = id;
    this.showModal = true;
    console.log("showModal set to:", this.showModal);
  }
  
  closeModal() {
    console.log("Closing modal");
    this.showModal = false;
    this.selectedUserId = null;
    console.log("showModal set to:", this.showModal);
  }
  
  confirmDelete() {
    console.log("Confirm Delete triggered");
    if (this.selectedUserId) {
      console.log("Deleting user with ID:", this.selectedUserId);
      this.deleteTask(this.selectedUserId);
      this.closeModal();
    }
  }



}
