<template>
  <v-dialog persistent v-model="isActive" v-if="isActive" width="30%">
    <v-card>
      <v-card-title class="text-h5">
        Excluir usuário ID: {{ id }}
      </v-card-title>

      <v-card-text class="mt-6">
        <p>
          Tem certeza que deseja excluir esse usuário?
          A operação não poderá ser desfeita.
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close">
          Cancelar
        </v-btn>
        <v-btn
          color="success"
          text
          @click="excluir"
        >
          Excluir usuário
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mode } from '@/models'
import { $axios } from '@/utils/nuxt-instance'
import { snackbar, screen } from '@/utils/store-access'

export default Vue.extend({
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    excluir() {
      this.loading = true

      $axios.$delete(`/api/users/${this.id}`)
        .then(r => {
          this.loading = false
          snackbar.setMessage('Usuário excluído com sucesso')
          snackbar.setSnackbar(true)
          this.close()
        })
        .catch(error => {
          this.loading = false
          this.close()
        })
    },
    close() {
      screen.setMode(Mode.LIST)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
