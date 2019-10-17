import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  @Input() channel: any;

  form: FormGroup;
  user: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
    private channelService: ChannelService) {
  }

  ngOnInit() {
    this.user = this.userService.getLocalUser();
    this.form = this.fb.group({
      id: ['', Validators.compose([Validators.required])],
      user_id: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      website: [''],
      email: ['', Validators.compose([Validators.email])],
      phone_number: [''],
      description: ['']
    });
    this.setUserData();
  }

  setUserData() {
    this.channelService.getById(this.channel.id).then(result => {
      if (result.success) {
        const data = result.data;
        this.form.get('id').setValue(data.id);
        this.form.get('user_id').setValue(this.user.id);
        this.form.get('name').setValue(data.name);
        this.form.get('website').setValue(data.website);
        this.form.get('email').setValue(data.email);
        this.form.get('phone_number').setValue(data.phone_number);
        this.form.get('description').setValue(data.description);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      this.channelService.update(data).then(result => {
        if (result.success) {
          this.activeModal.close(data);
        }
      });
    }
  }
}
