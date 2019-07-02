import { Component, OnInit } from '@angular/core';

// Services:
import { ChatService } from '../../services/chat/chat.service';
import { AuthService } from '../../services/auth/auth.service';

// Models:
import { Chat } from '../../models/chat.model'

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  chat: Chat;
  chatsArray: Array<Chat> = [];

  constructor(
    public auth: AuthService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(result => {
      this.chatService.getChats().subscribe(result =>{
        this.chatsArray = result;
      })
    });    
  }

}
