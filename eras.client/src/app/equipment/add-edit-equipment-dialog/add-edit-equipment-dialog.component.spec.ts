import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEquipmentDialogComponent } from './add-edit-equipment-dialog.component';

describe('AddEditEquipmentDialogComponent', () => {
  let component: AddEditEquipmentDialogComponent;
  let fixture: ComponentFixture<AddEditEquipmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditEquipmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEquipmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
