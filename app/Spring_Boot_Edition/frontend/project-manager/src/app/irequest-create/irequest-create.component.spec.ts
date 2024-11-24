import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrequestCreateComponent } from './irequest-create.component';

describe('IrequestCreateComponent', () => {
  let component: IrequestCreateComponent;
  let fixture: ComponentFixture<IrequestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IrequestCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IrequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
