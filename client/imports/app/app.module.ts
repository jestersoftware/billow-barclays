/*ANGULAR*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './app.routes';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

/*AUTH*/
import { AuthService } from './auth.service';

/*MATERIAL*/
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import 'animejs';

/*COMPONENTS*/
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EmailComponent } from './auth/email/email.component';
import { AdminComponent } from './web/admin/admin.component';
import { AdminThingComponent } from './web/admin-thing/admin-thing.component';
import { AdminListComponent } from './web/admin-list/admin-list.component';
import { AdminActionComponent } from './web/admin-action/admin-action.component';
import { WebsiteComponent } from './web/website/website.component';
import { WebsiteSectionComponent } from './web/website.section/website.section.component';

// import { HomeComponent } from './home/home.component';
// import { MaterialComponent } from './material/material.component';

/*SERVICES*/
import { UserService } from './user.service';
import { RoleService } from './role.service';
import { ViewService } from './view.service';
import { SchemaService } from './schema.service';
import { AdminService } from './admin.service';
import { ThingService } from './thing.service';
import { ThingImageService } from './thing.image.service';
import { DataService } from './data.service';

import { ScrollSpyModule } from 'ng2-scrollspy';
import { ScrollSpyParallaxModule } from 'ng2-scrollspy/dist/plugin/parallax'; 

/*IMAGES*/
import { FileUploadModule } from 'ng2-file-upload';

import { DisplayNamePipe } from './pipe/display-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    EmailComponent,
    AdminComponent,
    AdminThingComponent,
    AdminListComponent,
    AdminActionComponent,
    WebsiteComponent,
    WebsiteSectionComponent,
    DisplayNamePipe
    // DialogContent,
    // HomeComponent,
    // MaterialComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutes,
    MaterialModule,
    HttpModule,
    FormsModule,
    FileUploadModule,
  	ScrollSpyModule.forRoot(),
    ScrollSpyParallaxModule
  ],
  providers: [
    AuthService,
    UserService,
    RoleService,
    ViewService,
    SchemaService,
    AdminService,
    ThingService,
    ThingImageService,
    DataService,
    DisplayNamePipe
  ],
  bootstrap: [
    AppComponent
  ]/*,
  entryComponents: [
    DialogContent
  ]*/
  /*,
  providers: [
    ErrorHandler
  ]
  */
})
export class AppModule {}