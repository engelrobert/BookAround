import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Services:
import { BookService } from '../../services/book/book.service';
import { LocationsService } from '../../services/locations/locations.service';
import { AuthService } from '../../services/auth/auth.service';
import { HelperService } from 'src/app/services/helper/helper.service';

// Models: 
import { Book } from '../../models/book.model';
import { Copy } from '../../models/copy.model';

@Component({
  selector: 'app-add-book-search',
  templateUrl: './add-book-search.page.html',
  styleUrls: ['./add-book-search.page.scss'],
})
export class AddBookSearchPage implements OnInit {

  isbnForm: FormGroup;
  isbn: string;
  book: Book;
  copy: Copy;
  // Fields for Copy:
  state: string;
  comment: string;
  offer: string;
  data: any;
  @Input() listId: string;

  constructor(
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
    private fb: FormBuilder,
    private booksService: BookService,
    private locationService: LocationsService,
    public auth: AuthService,
    public helperService: HelperService
  ) { }

  ngOnInit() {
    this.isbnForm = new FormGroup({
      'isbn': new FormControl(this.isbn, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(13),
        Validators.pattern('^[0-9Xx]*$'),
      ])
    });
    this.state = 'Gut';
    this.offer = 'Zu tauschen';
  }

  get isbnString() {
    return this.isbnForm.get('isbn');
  }

  searchBook() {
    this.book = null;
    this.state = 'Gut';
    this.offer = 'Zu tauschen';
    this.comment = '';
    this.isbn = this.isbnForm.get('isbn').value;    
    if (this.booksService.isValidISBN(this.isbn)) {
      if (this.isbn.length === 10) {
        this.isbn = this.booksService.isbn10to13(this.isbn);
      }
      this.searchDatabase(this.isbn);
    }
  }

  searchDatabase(isbn: string) {
    this.booksService.searchDatabaseByIsbn(isbn).subscribe(res => {
      this.data = res
      if (this.data.length) {
        this.book = this.data[0];
      } else {
        this.searchGoogleBooksApi(isbn);
      }
    })
  }

  searchGoogleBooksApi(isbn: string) {
    this.booksService.searchGoogleByIsbn(isbn).subscribe(
      response => {
        this.data = response;
        if (this.data.totalItems > 0) {
          this.booksService.getBookWithGoogle(this.data.items[0].selfLink).subscribe(
            (response: any) => {              
              this.book = {
                title: (response.volumeInfo['title']) ? response.volumeInfo['title'] : '',
                subtitle: (response.volumeInfo['subtitle']) ? response.volumeInfo['subtitle'] : '',
                imageurl: (response.volumeInfo['imageLinks']) ? response.volumeInfo['imageLinks']['smallThumbnail'] : '',
                description: (response.volumeInfo['description']) ? response.volumeInfo['description'] : '',
                language: (response.volumeInfo['language']) ? response.volumeInfo['language'] : '',
                isbn: (response.volumeInfo['industryIdentifiers']) ? response.volumeInfo['industryIdentifiers'][1]['identifier'] : '',
                authors: (response.volumeInfo['authors']) ? response.volumeInfo['authors'] : [],
                publisher: (response.volumeInfo['publisher']) ? response.volumeInfo['publisher'] : '',
                publishDate: (response.volumeInfo['publishedDate']) ? response.volumeInfo['publishedDate'] : '',
                pages: (response.volumeInfo['pageCount']) ? response.volumeInfo['pageCount'] : '',
              }              
              this.booksService.addBook(this.book);
            },
            error => {
              console.log(error);
            }
          );
        } else {
          console.log('Kein Ergebnis');
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  addBook() {
    this.copy = this.book;
    this.copy.state = this.state;
    this.copy.offer = this.offer;
    this.copy.comment = this.comment;
    this.copy.id = Date.now().toString();
    const helper = this.helperService;
    let bookArray: Array<Copy>;    
    let data = { userName: this.auth.displayName, bookArray: [] };
    this.locationService.getLocation().subscribe(result => {
      if (result) {
        data = result.data;
      } else {
        data = { userName: '', bookArray: [] };
      }      
      data.userName = this.auth.displayName;
      data.bookArray.push(this.copy);
      this.locationService.addLocation(data)
      .then(function (result) {
        helper.showToast('Das Buch wurde zu deinem Profil hinzugefügt');
      })
      .catch(function (err) {
        helper.showToast('Beim Hinzufügen des Buches ist ein Fehler aufgetreten.');
        console.log(err)
      }).finally(() => {
        this.dismiss();
      });
    })
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
