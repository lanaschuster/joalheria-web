<template>
  <div class="component">
    <h1 class="title text-h4 mb-8">Meu Perfil</h1>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8">
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="4"
                class="d-flex align-center justify-center"
              >
                <v-hover v-slot="{ hover }">
                  <v-avatar size="240">
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
              </v-col>
              <v-col cols="12" sm="12" md="8" class="text-body-1 d-flex align-center flex-column">
                
                <label class="font-weight-bold">Nome</label>
                <span>{{ `${user.name} ${user.lastName}` }}</span>

                <label class="font-weight-bold">Função</label>
                <span>{{ user.role.name }}</span>
              

                <label class="font-weight-bold">E-mail</label>
                <span>{{ user.email }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
        avatar: '/img/image.svg'
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
          this.user = r
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
    }
  },
  created() {
    this.find()
  },
})
</script>

<style lang="scss" scoped>
</style>
