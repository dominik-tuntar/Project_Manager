import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalProjectCreateComponent } from './final-project-create.component';

describe('FinalProjectCreateComponent', () => {
  let component: FinalProjectCreateComponent;
  let fixture: ComponentFixture<FinalProjectCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalProjectCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalProjectCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
