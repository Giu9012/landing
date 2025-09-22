import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTeacher } from './dashboard-teacher';

describe('DashboardTeacher', () => {
  let component: DashboardTeacher;
  let fixture: ComponentFixture<DashboardTeacher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTeacher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTeacher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
