import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiesPage } from './copies.page';

describe('CopiesPage', () => {
  let component: CopiesPage;
  let fixture: ComponentFixture<CopiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopiesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
