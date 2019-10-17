import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    EditProfileComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    EditProfileComponent
  ],
  providers: [],
  entryComponents: [
    EditProfileComponent
  ]
})
export class ComponentsModule { }
