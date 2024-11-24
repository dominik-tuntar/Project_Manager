import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CattributeCreateComponent } from './cattribute-create.component';

describe('CattributeCreateComponent', () => {
  let component: CattributeCreateComponent;
  let fixture: ComponentFixture<CattributeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CattributeCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CattributeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
