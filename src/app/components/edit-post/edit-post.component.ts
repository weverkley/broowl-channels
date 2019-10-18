import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  @Input() post: any;

  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private postService: PostService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.post.id, Validators.compose([Validators.required])],
      channel_id: [this.post.channel_id, Validators.compose([Validators.required])],
      content: [this.post.content, Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      this.postService.update(data).then(result => {
        if (result.success) {
          this.activeModal.close(data);
        }
      });
    }
  }
}
