import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scope2TrackingComponent } from './scope2-tracking.component';

describe('Scope2TrackingComponent', () => {
  let component: Scope2TrackingComponent;
  let fixture: ComponentFixture<Scope2TrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Scope2TrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Scope2TrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
