import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubgroupComponent } from './subgroup.component';

describe('SubgroupComponent', () => {
  let component: SubgroupComponent;
  let fixture: ComponentFixture<SubgroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubgroupComponent]
    });
    fixture = TestBed.createComponent(SubgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
