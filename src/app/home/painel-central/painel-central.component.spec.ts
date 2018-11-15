import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelCentralComponent } from './painel-central.component';

describe('PainelCentralComponent', () => {
  let component: PainelCentralComponent;
  let fixture: ComponentFixture<PainelCentralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelCentralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelCentralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
