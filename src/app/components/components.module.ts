import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditPostComponent } from './edit-post/edit-post.component';

@NgModule({
  declarations: [
    EditProfileComponent,
    EditPostComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    EditProfileComponent,
    EditPostComponent
  ],
  providers: [],
  entryComponents: [
    EditProfileComponent,
    EditPostComponent
  ]
})
export class ComponentsModule { }
