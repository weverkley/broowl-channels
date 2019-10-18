import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { ChannelService } from 'src/app/services/channel.service';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { EditPostComponent } from 'src/app/components/edit-post/edit-post.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('profilePicture', { static: true }) profilePicture: ElementRef;
  @ViewChild('profileCover', { static: true }) profileCover: ElementRef;
  @ViewChild('postImage', { static: true }) postImage: ElementRef;
  @ViewChild('postVideo', { static: true }) postVideo: ElementRef;

  form: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  user: any;
  channel: any;
  posts: any[];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private channelService: ChannelService,
    private postService: PostService) {
    this.user = this.userService.getLocalUser();
    this.getUser();
  }

  ngOnInit() {
    this.channel = JSON.parse(localStorage.getItem('selected-channel'));
    this.form = this.fb.group({
      channel_id: [this.channel.id, Validators.required],
      content: ['', Validators.required]
    });
    this.form1 = this.fb.group({
      channel_id: [this.channel.id, Validators.required],
      image: ['', Validators.required]
    });
    this.form2 = this.fb.group({
      channel_id: [this.channel.id, Validators.required],
      image: ['', Validators.required]
    });
  }

  logout() {
    Swal.fire({
      title: 'Finalizar sessão',
      text: "Tem certeza que deseja finalizar sua sessão atual?",
      type: 'warning',
      customClass: {
        popup: 'custom-alert'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.authService.logout();
      }
    })
  }

  openModalEdit() {
    const modalRef = this.modalService.open(EditProfileComponent, { windowClass: 'modal-dark' });
    modalRef.componentInstance.channel = this.channel;
  }

  getProfilePic() {
    return 'https://storage.googleapis.com/broowl-dev/' + this.user.id + '/images/profile.png';
  }

  getCoverPic() {
    return 'https://storage.googleapis.com/broowl-dev/' + this.user.id + '/images/channel/' + this.channel.id + '/cover.jpeg';
  }

  getUser() {
    this.userService.getUserById(this.user.id).then(result => {
      if (result.success) {
        this.user = result.data;
        this.setSelectedChannel();
      }
    });
  }

  setSelectedChannel() {
    let page = JSON.parse(localStorage.getItem('selected-channel'));
    if (!page) {
      localStorage.setItem('selected-channel', JSON.stringify(this.user.channels[0]));
      page = this.user.channels[0];
    }

    this.channel = page;
    this.getPosts();
  }

  getPosts() {
    this.channelService.getPostsByChannelId(this.channel.id).then(result => {
      if (result.success) {
        this.posts = result.data.posts;
      }
    });
  }

  selectChannel(e) {
    const data = e.target.value;
    localStorage.setItem('selected-channel', JSON.stringify(data));
    this.channel = data;
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      this.postService.add(data).then(result => {
        if (result.success) {
          Swal.fire({
            text: 'Postagem criada com sucesso.',
            type: 'success',
            confirmButtonText: 'Ok',
            customClass: {
              popup: 'animated tada'
            }
          });
          this.posts.push(result.data);
          this.form.reset();
        }
      });
    }
  }

  changeProfile() {
    let inputElement: HTMLElement = this.profilePicture.nativeElement as HTMLElement;
    inputElement.click();
  }

  processProfile(imageInput) {
    if (imageInput.files[0]) {
      const file: File = imageInput.files[0];
      var pattern = /image-*/;

      if (!file.type.match(pattern)) {
        Swal.fire({
          text: 'Imagem com formato inválido.',
          type: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            popup: 'custom-alert'
          }
        })
        return;
      }

      this.getBase64(file).then(base64 => {
        const data = {
          user_id: this.user.id,
          image: base64,
          mimetype: this.base64MimeType(base64)
        };
        this.userService.uploadProfile(data).then(result => {
          Swal.fire({
            text: 'Imagem alterada com sucesso.',
            type: 'success',
            confirmButtonText: 'Ok',
            customClass: {
              popup: 'custom-alert'
            }
          });
        });
      });
    }
  }

  changeCover() {
    let inputElement: HTMLElement = this.profileCover.nativeElement as HTMLElement;
    inputElement.click();
  }

  processCover(imageInput) {
    if (imageInput.files[0]) {
      const file: File = imageInput.files[0];
      var pattern = /image-*/;

      if (!file.type.match(pattern)) {
        Swal.fire({
          text: 'Imagem com formato inválido.',
          type: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            popup: 'custom-alert'
          }
        })
        return;
      }

      this.getBase64(file).then(base64 => {
        const data = {
          channel_id: this.channel.id,
          image: base64,
          mimetype: this.base64MimeType(base64)
        };
        this.channelService.uploadCover(data).then(result => {
          Swal.fire({
            text: 'Imagem alterada com sucesso.',
            type: 'success',
            confirmButtonText: 'Ok',
            customClass: {
              popup: 'custom-alert'
            }
          });
        });
      });
    }
  }

  deletePost(item) {
    Swal.fire({
      text: "Tem certeza que deseja deletar esta postagem, suas alterações serão irreversiveis?",
      type: 'warning',
      customClass: {
        popup: 'custom-alert'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.postService.delete(item.id).then(result => {
          const index = this.posts.indexOf(item);
          this.posts.splice(index, 1);
          Swal.fire({
            text: 'Sua postagem foi deletada com sucesso.',
            type: 'success',
            confirmButtonText: 'Ok',
            customClass: {
              popup: 'custom-alert'
            }
          });
        });
      }
    })
  }

  editPost(item) {
    const modalRef = this.modalService.open(EditPostComponent, { windowClass: 'modal-dark' });
    modalRef.componentInstance.post = item;
    modalRef.result.then((result) => {
      if (typeof result != undefined) {
        this.getPosts();
      }
    });
  }

  onImageSelected(imageInput) {
    if (imageInput.files[0]) {
      const file: File = imageInput.files[0];
      var pattern = /image-*/;

      if (!file.type.match(pattern)) {
        Swal.fire({
          text: 'Imagem com formato inválido.',
          type: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            popup: 'custom-alert'
          }
        })
        return;
      }

      this.getBase64(file).then(base64 => {
        const data = {
          channel_id: this.channel.id,
          image: base64,
          mimetype: this.base64MimeType(base64)
        };
      });
    }
  }

  onVideoSelected(videoInput) {
    if (videoInput.files[0]) {
      const file: File = videoInput.files[0];
      var pattern = /video-*/;

      if (!file.type.match(pattern)) {
        Swal.fire({
          text: 'Video com formato inválido.',
          type: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            popup: 'custom-alert'
          }
        })
        return;
      }

      this.getBase64(file).then(base64 => {
        const data = {
          channel_id: this.channel.id,
          video: base64,
          mimetype: this.base64MimeType(base64)
        };
      });
    }
  }

  getBase64(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  base64MimeType(encoded) {
    var result = null;
    if (typeof encoded !== 'string') {
      return result;
    }
    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }
    return result;
  }
}
