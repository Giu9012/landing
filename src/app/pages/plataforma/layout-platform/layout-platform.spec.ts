import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPlatform } from './layout-platform';

describe('LayoutPlatform', () => {
  let component: LayoutPlatform;
  let fixture: ComponentFixture<LayoutPlatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPlatform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutPlatform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
