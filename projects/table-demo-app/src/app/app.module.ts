import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEditableMaterialTableComponent } from 'ngx-editable-material-table';

@NgModule({
  declarations: [
    AppComponent

  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    NgxEditableMaterialTableComponent,
    BrowserAnimationsModule,
    MatTableModule
  ]
})
export class AppModule {
}
