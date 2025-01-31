import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { OpenaiService } from '../../../core/service/openai/openai.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})

  export class LeaderboardComponent implements OnInit {

    userDetails: any[] = [];
    statistics: any = {};
    category: any[] = []
    loading: boolean = true;
    

    openaiServce = inject(OpenaiService)


    ngOnInit() {

      this.loadUsers()
      
    }

    loadUsers() {
      this.openaiServce.displayUserDetails().subscribe({
        next: (response) => {
          this.userDetails = response.influencers;
          this.statistics = response.statistics;
          this.category = [...new Set(response.influencers.map((influencer: any) => influencer.Category))];
          
          // Set loading to false once data is loaded
          this.loading = false;
          console.log(this.userDetails);
          console.log('Statistics:', this.statistics);
        },
        error: () => {
          this.loading = false;
        }
      });
    }

  }
