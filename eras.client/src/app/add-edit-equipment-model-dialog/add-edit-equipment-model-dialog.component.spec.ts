import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEquipmentModelDialogComponent } from './add-edit-equipment-model-dialog.component';

describe('AddEditEquipmentDialogComponent', () => {
  let component: AddEditEquipmentModelDialogComponent;
  let fixture: ComponentFixture<AddEditEquipmentModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditEquipmentModelDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEquipmentModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
