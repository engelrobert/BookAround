import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';

// Services:
import { AuthService } from '../auth/auth.service';

// Models:
import { Chat } from '../../models/chat.model';
import { Message } from '../../models/message.model';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatCollection: AngularFirestoreCollection<Chat>;
  chats: Observable<Chat[]>

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  async createChat(recipientId: string, topic: string, bookId?: string) {
    const uid = await this.auth.userId;
    const data: Chat = {
      bookId: bookId,
      usersIds: [uid, recipientId],
      topic: topic,
      updatedAt: Date.now(),
      count: 0,
      read: false,
      messages: []
    }
    const docRef = await this.afs.collection('chats').add(data);
    return this.router.navigate(['app/tabs/chat', docRef.id]);
  }

  getChat(chatId) {
    return this.afs
      .collection<Chat>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  getChats() {   
    const uid = this.auth.userId;
    console.log(uid);    
    this.chatCollection = this.afs.collection<Chat>('chats', ref =>
      ref.where('usersIds', 'array-contains', uid)
    );
    return this.chats = this.chatCollection.snapshotChanges()
      .pipe(
        map(changes => changes.map(({ payload: { doc } }) => {
          const data = doc.data();
          const id = doc.id
          return { id, ...data };
        })))
  }

  async sendMessage(chatId, content) {
    const uid = await this.auth.userId;
    const data: Message = {
      uid: uid,
      createdAt: Date.now(),
      content: content
    }
    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }




}
