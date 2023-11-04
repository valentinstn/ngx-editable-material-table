import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxEditableMaterialTableComponent } from './ngx-editable-material-table.component';

describe('NgxEditableMaterialTableComponent', () => {
  let component: NgxEditableMaterialTableComponent;
  let fixture: ComponentFixture<NgxEditableMaterialTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxEditableMaterialTableComponent]
    });
    fixture = TestBed.createComponent(NgxEditableMaterialTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
