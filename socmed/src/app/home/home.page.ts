import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  body = '';
  constructor() {}

  onCreatePost(body: string) {
    console.log('create home');
    this.body = body;
    console.log('this.bdy', this.body);
  }
}
