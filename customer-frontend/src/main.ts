// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // keep this
import { AppComponent } from './app/app.component'; // keep this

import { routes } from './app/app.routes'; // ✅ FIX: this must include `app/`

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));