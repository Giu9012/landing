import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEstudent } from './dashboard-estudent';

describe('DashboardEstudent', () => {
  let component: DashboardEstudent;
  let fixture: ComponentFixture<DashboardEstudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEstudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEstudent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
