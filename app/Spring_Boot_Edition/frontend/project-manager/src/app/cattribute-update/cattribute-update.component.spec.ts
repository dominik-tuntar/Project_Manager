import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CattributeUpdateComponent } from './cattribute-update.component';

describe('CattributeUpdateComponent', () => {
  let component: CattributeUpdateComponent;
  let fixture: ComponentFixture<CattributeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CattributeUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CattributeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
