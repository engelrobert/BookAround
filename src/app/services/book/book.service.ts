import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Book } from '../../models/book.model'

@Injectable({
  providedIn: 'root'
})
export class BookService {
  url: string;
  data: any;
  book: Book;
  private bookCollection: AngularFirestoreCollection<Book>;

  constructor(
    public http: HttpClient,
    private afs: AngularFirestore
  ) { }


  isValidISBN(isbn: string): Boolean {
    //clean up isbn:
    isbn = isbn.replace(/[^0-9X]/gi, '');

    //Check if ISBN has right length
    if (isbn.length != 10 && isbn.length != 13) {
      return false;
    }

    if (isbn.length === 13) {
      let prefix: string = isbn.substring(0, 3);
      if (prefix !== "978") {
        console.log("Wrong Prefix " + isbn)
        return false;
      }
      let sum: number = 0;
      for (let i = 0; i < 12; i++) {
        let digit: number = parseInt(isbn[i]);
        if (i % 2 === 1) {
          sum += 3 * digit;
        } else {
          sum += digit;
        }
      }
      let check = (10 - (sum % 10)) % 10;
      return (check === parseInt(isbn[isbn.length - 1]));
    }

    if (isbn.length === 10) {
      let weight: number = 10;
      let sum: number = 0;
      for (let i = 0; i < 9; i++) {
        let digit: number = parseInt(isbn[i]);
        sum += weight * digit;
        weight--;
      }
      let check: string = (11 - (sum % 11)).toString();
      if (check === '10') {
        check = 'X';
      }
      return (check == isbn[isbn.length - 1].toUpperCase());
    }
  }

  isbn10to13(isbn10: string): string {
    let isbn13: string = `978${isbn10.substr(0, 9)}`;
    let sum: number = 0;
    for (let i = 0; i < 12; i++) {
      let digit: number = parseInt(isbn13[i]);
      if (i % 2 === 1) {
        sum += 3 * digit;
      } else {
        sum += digit;
      }
    }
    let check: number = (10 - (sum % 10)) % 10;
    isbn13 += check;
    return isbn13;
  }

  searchDatabaseByIsbn(isbn: string) {
    this.bookCollection = this.afs.collection<Book>('books', ref =>
      ref.where('isbn', '==', isbn).limit(1)
    );
    return this.bookCollection.valueChanges().pipe(take(1));
  }

  searchGoogleByIsbn(isbn: string): Observable<Object> {
    this.url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;
    return this.http.get(this.url);
  }

  getBookWithGoogle(url: string): Observable<Object> {
    return this.http.get(url);
  }

  // Firebase Book Functions:
  addBook(book: Book): Promise<DocumentReference> {
    this.bookCollection = this.afs.collection<Book>('books');
    return this.bookCollection.add(book);
  }


}
