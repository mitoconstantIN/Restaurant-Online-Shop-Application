import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';

bootstrapApplication(AppComponent, appConfig)
 .catch((err) => console.error(err));

