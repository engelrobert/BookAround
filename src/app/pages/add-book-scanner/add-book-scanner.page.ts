import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import Quagga from 'quagga';

// Services:
import { BookService } from '../../services/book/book.service';
import { LocationsService } from '../../services/locations/locations.service';
import { AuthService } from '../../services/auth/auth.service';
import { HelperService } from 'src/app/services/helper/helper.service';

// Models: 
import { Book } from '../../models/book.model';
import { Copy } from '../../models/copy.model';

@Component({
  selector: 'app-add-book-scanner',
  templateUrl: './add-book-scanner.page.html',
  styleUrls: ['./add-book-scanner.page.scss'],
})
export class AddBookScannerPage implements OnInit {

  isbn: string;
  book: Book;
  copy: Copy;
  // Fields for Copy:
  state: string;
  comment: string;
  offer: string;
  data: any;
  cameraError: Boolean = false;

  constructor(
    public modalCtrl: ModalController,
    private booksService: BookService,
    private locationService: LocationsService,
    public auth: AuthService,
    public helperService: HelperService
  ) { }

  ngOnInit() {
    this.state = 'Gut';
    this.offer = 'Zu tauschen';
  }

  startScanner() {
    let that = this;
    let bs = this.booksService;
    document.querySelector('#scanner').innerHTML = 'Noch keine ISBN gefunden!';

    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner'),
        constraints: {
          aspectRatio: { min: 1, max: 100 },
          facingMode: "environment"
        },
      },
      decoder: {
        readers: [
          "ean_reader"
        ],
        multiple: false
      },
      locator: {
        patchSize: "medium",
      },
      locate: true,
      numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
      frequency: 5,
      debug: false
    }, function (err) {
      if (err) {
        console.log(err);
        that.cameraError = true;
        return
      }
      Quagga.start();
    });

    Quagga.onProcessed(function (result) {
      let drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
          result.boxes.filter(function (box) {
            return box !== result.box;
          }).forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
      }
    });


    Quagga.onDetected(function (result) {
      if (bs.isValidISBN(result.codeResult.code)) {
        document.querySelector('#scanner').innerHTML = result.codeResult.code;
        that.searchBook(result.codeResult.code);
        Quagga.stop();
      }
    });
  }

  searchBook(isbn) {
    this.isbn = isbn;
    this.book = null;
    this.state = 'Gut';
    this.offer = 'Zu tauschen';
    this.comment = '';
    if (this.booksService.isValidISBN(isbn)) {
      if (this.isbn.length === 10) {
        this.isbn = this.booksService.isbn10to13(isbn);
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
    //TODO: Stopp Quagga
    if (Quagga !== undefined) {
      Quagga.stop();
    }
    this.modalCtrl.dismiss();
  }



}
