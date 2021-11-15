<template>
  <div class="component">
    <div class="cover"></div>
    <v-hover v-slot="{ hover }" class="avatar">
      <v-avatar class="avatar-img">
        <v-img
          lazy-src="/img/image.svg"
          style="position: absolute"
          :src="imagePreview"
          alt="Avatar"
        >
        </v-img>

        <v-img v-if="hover" src="/img/image-hover.svg" alt="Avatar">
          <input
            type="file"
            accept="image/*"
            style="opacity: 0; cursor: pointer"
            @change="changeImage($event)"
          />
        </v-img>
      </v-avatar>
    </v-hover>

    <div>
      <span class="name">{{ `${user.name} ${user.lastName}` }}</span>
      <span class="description">{{ user.role.name }}</span>
      <span class="description">{{ user.email }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { User } from '@/models'
import { $axios } from '@/utils/nuxt-instance'
import { snackbar } from '@/utils/store-access'

export default Vue.extend({
  data() {
    return {
      loading: false,
      user: {
        role: {
          name: '',
        },
        name: '',
        lastName: '',
        email: '',
        avatar: '/img/image.svg',
      },
      imagePreview: '/img/image.svg',
    }
  },
  methods: {
    find() {
      this.loading = true
      $axios
        .$get(`/api/users/myself`)
        .then((r) => {
          this.loading = false
          this.user = r.user
          if (this.user.avatar) {
            this.user.avatar = `${process.env.apiUrl}/${this.user.avatar}`
            this.imagePreview = this.user.avatar
          }
        })
        .catch((error) => {
          this.loading = false
        })
    },
    toBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    changeImage(event: any) {
      this.user.avatar = event.target.files[0]
      this.toBase64(this.user.avatar as any).then((r) => {
        this.imagePreview = r as string
        this.uploadAvatar(this.user.avatar as any)
      })
    },
    uploadAvatar(avatar: File) {
      this.loading = true
      let formData = new FormData()
      formData.append('avatar', avatar)

      $axios
        .$post(`/api/users/upload`, formData)
        .then((r) => {
          this.loading = false
          snackbar.setMessage('Avatar alterado com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
  created() {
    this.find()
  },
})
</script>

<style lang="scss" scoped>
.component {
  display: flex;
  flex-wrap: wrap;
}
.avatar-img {
  width: 240px !important;
  height: 240px !important;
  margin-left: 2rem;
}
.cover {
  height: 16rem;
  width: 100%;
  border-radius: 6px;
  background: url('/img/ring_cover.jpg') no-repeat;
  background-size: cover;
  background-position: center;
  margin-bottom: 1rem;
}
.avatar {
  display: flex;
  justify-content: center;
  margin-top: -80px !important;
}
.component div span {
  margin-left: 1rem;
  display: block;
}
.name {
  font-weight: bold;
  font-size: 1.4rem;
}
@media screen and (min-width: 427px) and (max-width: 1224px){
  .avatar-img {
    width: 160px !important;
    height: 160px !important;
    margin-left: 1rem;
  }
  .component div {
    position: initial;
    margin-left: 1rem;
  }
  .name {
    margin-top: 0px;
  }
}
@media screen and (max-width: 426px) {
  .avatar-img {
    width: 160px !important;
    height: 160px !important;
    margin: 0 auto;
  }
  .component div {
    margin: 0 auto;
  }
  .component div span {
    text-align: center;
    margin-left: 0;
  }
}
</style>
