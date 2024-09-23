import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VncClientComponent } from './vnc-client.component';

describe('VncClientComponent', () => {
  let component: VncClientComponent;
  let fixture: ComponentFixture<VncClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VncClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VncClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
