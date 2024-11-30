import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/partials/header/header.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { LoadingComponent } from "./components/partials/loading/loading.component";
import { HttpClient } from '@angular/common/http';
import { TestComponent } from './test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HomeComponent, LoadingComponent, TestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://jsonplaceholder.typicode.com/posts').subscribe(response => {
    });
  }
}
