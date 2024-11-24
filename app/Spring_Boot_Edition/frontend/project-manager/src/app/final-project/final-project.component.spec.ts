import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalProjectComponent } from './final-project.component';

describe('FinalProjectComponent', () => {
  let component: FinalProjectComponent;
  let fixture: ComponentFixture<FinalProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
