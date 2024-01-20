import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimillarProductsComponent } from './simillar-products.component';

describe('SimillarProductsComponent', () => {
  let component: SimillarProductsComponent;
  let fixture: ComponentFixture<SimillarProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimillarProductsComponent]
    });
    fixture = TestBed.createComponent(SimillarProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
