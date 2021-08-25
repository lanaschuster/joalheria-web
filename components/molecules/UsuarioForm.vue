<template>
  <form @submit.prevent="onSubmit">
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-switch
          inset
          :disabled="isViewMode"
          v-model="form.isActive"
          :label="form.isActive ? 'Ativo' : 'Bloqueado'"
        ></v-switch>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-text-field
          outlined
          :readonly="isViewMode"
          color="primary"
          type="text"
          label="Nome"
          v-model="form.name"
          placeholder="Nome"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="12" md="4">
        <v-text-field
          outlined
          :readonly="isViewMode"
          color="primary"
          type="text"
          label="Sobrenome"
          v-model="form.lastName"
          placeholder="Sobrenome"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="12" md="4">
        <v-text-field
          outlined
          :readonly="isViewMode"
          color="primary"
          type="email"
          label="E-mail"
          v-model="form.email"
          placeholder="E-mail"
        ></v-text-field>
      </v-col>

      <v-col v-if="!isViewMode" cols="12" sm="12" md="4">
        <v-text-field
          outlined
          :readonly="isViewMode"
          color="primary"
          type="password"
          label="Senha"
          v-model="form.password"
          placeholder="Senha"
        ></v-text-field>
      </v-col>

      <v-col v-if="!isViewMode" cols="12" sm="12" md="4">
        <v-text-field
          outlined
          color="primary"
          type="password"
          label="Confirmação de senha"
          v-model="confirmPassword"
          placeholder="Repita a senha"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="12" md="4">
        <v-select
          outlined
          :disabled="isViewMode"
          color="primary"
          :items="roles"
          v-model="form.role"
          label="Permissão"
        >
          <template #item="{ item }">
            <span class="primary--text">{{ item.name }}</span>
          </template>
          <template #selection="{ item }">
            {{ item.name }}
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-btn outlined color="primary" @click="voltar">Voltar</v-btn>
        <v-btn type="submit" v-if="!isViewMode" color="primary">Salvar</v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { User, Role, Mode } from '@/models'
import { $axios } from '@/utils/nuxt-instance'
import { screen, snackbar } from '@/utils/store-access'

export default Vue.extend({
  props: {
    id: {
      type: Number
    },
  },
  data() {
    return {
      form: {
        name: '',
        lastName: '',
        email: '',
        isActive: true
      } as User,
      confirmPassword: '',
      loading: false,
      roles: [] as Role[]
    }
  },
  computed: {
    isViewMode() {
      return screen.$mode === Mode.VIEW
    }
  },
  methods: {
    onSubmit() {
      if (screen.$mode === Mode.ADD) {
        this.cadastrar()
      } else if (screen.$mode === Mode.EDIT) {
        this.alterar()
      }
    },
    cadastrar() {
      this.loading = true

      let user = { ...this.form }
      user.roleId = user.role.id

      $axios.$post(`/api/users`, user)
        .then(r => {
          this.loading = false
          this.voltar()
          snackbar.setMessage('Usuário cadastrado com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.message)
          } else {
            snackbar.setMessage(
              'Não foi possível cadastrar o usuário.'
            )
          }

          snackbar.setSnackbar(true)
        })
    },
    alterar() {
      this.loading = true

      let user = { ...this.form }
      user.roleId = user.role.id

      $axios.$put(`/api/users/${this.id}`, user)
        .then(r => {
          this.loading = false
          this.voltar()
          snackbar.setMessage('Usuário editado com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.message)
          } else {
            snackbar.setMessage(
              'Não foi possível editar o usuário.'
            )
          }

          snackbar.setSnackbar(true)
        })
    },
    voltar() {
      this.$emit('id', undefined)
      screen.setMode(Mode.LIST)
    },
    find() {
      this.loading = true
      $axios.$get(`/api/users/${this.id}`)
        .then(r => {
          this.loading = false
          this.form = r
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage(
              'Não foi possível consultar o usuário selecionado.'
            )
          }

          snackbar.setSnackbar(true)
        })
    },
    findRoles() {
      this.loading = true
      $axios.$get(`/api/roles`)
        .then(r => {
          this.loading = false
          this.roles = r
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage(
              'Não foi possível consultar as permissões.'
            )
          }

          snackbar.setSnackbar(true)
        })
    }
  },
  created() {
    if (this.id) {
      this.find()
    }
    
    this.findRoles()
  }
})
</script>

<style lang="scss" scoped>
</style>
