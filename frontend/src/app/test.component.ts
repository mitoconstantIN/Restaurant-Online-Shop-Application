import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,  // Asigură-te că este setat la true
  template: `<p>Test Component Loaded</p>`,
})
export class TestComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://jsonplaceholder.typicode.com/posts').subscribe(response => {
      console.log('Response:', response);
    });
  }
}
