import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookPage } from './add-book.page';

describe('AddBookPage', () => {
  let component: AddBookPage;
  let fixture: ComponentFixture<AddBookPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBookPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
