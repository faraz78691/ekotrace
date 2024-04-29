import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scope3TrackingComponent } from './scope3-tracking.component';

describe('Scope3TrackingComponent', () => {
  let component: Scope3TrackingComponent;
  let fixture: ComponentFixture<Scope3TrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Scope3TrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Scope3TrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
