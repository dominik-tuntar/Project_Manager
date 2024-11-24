import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrequestComponent } from './irequest.component';

describe('IrequestComponent', () => {
  let component: IrequestComponent;
  let fixture: ComponentFixture<IrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IrequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
