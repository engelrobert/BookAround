import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookSearchPage } from './add-book-search.page';

describe('AddBookSearchPage', () => {
  let component: AddBookSearchPage;
  let fixture: ComponentFixture<AddBookSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBookSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
