import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalProjectUpdateComponent } from './final-project-update.component';

describe('FinalProjectUpdateComponent', () => {
  let component: FinalProjectUpdateComponent;
  let fixture: ComponentFixture<FinalProjectUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalProjectUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalProjectUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
