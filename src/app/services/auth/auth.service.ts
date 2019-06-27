import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Import User Model
import { User } from '../../models/user.model';

//Import Firebase
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userId: string;
  displayName: string;
  lat: number;
  lng: number;
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Loged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      }))
    this.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.displayName = user.displayName;
        this.lat = user.lat;
        this.lng = user.lng;
      }
    })
  }

  async googleSignin(): Promise<void> {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    this.router.navigate(['/']);
    return this.setUserData(credential.user);
  }  

  async sendEmailVerification(): Promise<void> {
    await this.afAuth.auth.currentUser.sendEmailVerification()
    this.router.navigate(['verify-email']);
  }

  async sendPasswordResetEmail(passwordResetEmail: string): Promise<void> {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  private setUserData(user: User): Promise<void> {   
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    return userRef.set(data, { merge: true })
  }

  updateUser(user: User): Promise<void>{
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    return userRef.update(user);
  }

  async signOut(): Promise<void> {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

}
