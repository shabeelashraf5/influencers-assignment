import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-influencer-page',
  imports: [NavbarComponent],
  templateUrl: './influencer-page.component.html',
  styleUrl: './influencer-page.component.css'
})
export class InfluencerPageComponent implements OnInit {

  userId!: string

  private activatedRoute = inject(ActivatedRoute)

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('id')!;
    
    });


    
  }



}
