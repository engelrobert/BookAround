import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

// Services:
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chat$: Observable<any>;
  newMsg: string;
  chatId: string;

  constructor(
    public cs: ChatService,
    private activatedRoute: ActivatedRoute,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.chatId = this.activatedRoute.snapshot.paramMap.get('chatId');
    const source = this.cs.getChat(this.chatId);
    this.chat$ = this.cs.joinUsers(source);
  }

  submit() {
    this.cs.sendMessage(this.chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }
  
}
