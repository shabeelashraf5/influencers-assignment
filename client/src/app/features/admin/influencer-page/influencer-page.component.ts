import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../../core/service/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-influencer-page',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './influencer-page.component.html',
  styleUrl: './influencer-page.component.css'
})
export class InfluencerPageComponent implements OnInit {

  userId!: string
  influDatas: any = {}

  private activatedRoute = inject(ActivatedRoute)
  private dashboardSerice = inject(DashboardService)

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('id')!;
      this.loadInfluencer()
    
    });
    
  }

  loadInfluencer() {
    this.dashboardSerice.displayInfluencers(this.userId).subscribe({
      next: (response) => {

        this.influDatas = response.showlist
        console.log(this.influDatas)

      },
      error: (err) => console.error('Error loading files', err),
    });
    
  }



}
