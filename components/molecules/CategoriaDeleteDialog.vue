<template>
  <v-dialog persistent v-model="isActive" v-if="isActive" width="30%">
    <v-card>
      <v-card-title class="text-h5">
        Excluir categoria ID: {{ id }}
      </v-card-title>

      <v-card-text class="mt-6">
        <p>
          Tem certeza que deseja excluir essa categoria?
          A operação não poderá ser desfeita.
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close">
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          text
          @click="excluir"
        >
          Excluir categoria
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

      $axios.$delete(`/api/categories/${this.id}`)
        .then(r => {
          this.loading = false
          snackbar.setMessage('Categoria excluída com sucesso')
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
