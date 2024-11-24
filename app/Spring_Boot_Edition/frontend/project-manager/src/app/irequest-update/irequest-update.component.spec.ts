import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrequestUpdateComponent } from './irequest-update.component';

describe('IrequestUpdateComponent', () => {
  let component: IrequestUpdateComponent;
  let fixture: ComponentFixture<IrequestUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IrequestUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IrequestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
