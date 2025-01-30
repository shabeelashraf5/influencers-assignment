import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerPageComponent } from './influencer-page.component';

describe('InfluencerPageComponent', () => {
  let component: InfluencerPageComponent;
  let fixture: ComponentFixture<InfluencerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfluencerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
