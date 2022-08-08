import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
   body = '';
  constructor() {}

  onCreatePost(body: string) {
    console.log('create home');
    this.body = body;
    console.log('this.bdy', this.body);
  }

  ngOnInit() {}}
