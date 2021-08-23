<template>
  <form action="">
    <v-row class="d-flex align-center">
      <v-col cols="12" sm="12" md="4">
        <v-select
          outlined
          color="secondary"
          :items="paymentMethods"
          v-model="form.paymentMethod"
          label="Método de pagamento"
        >
          <template #item="{ item }">
            <span class="secondary--text">{{ item.name }}</span>
          </template>
          <template #selection="{ item }">
            {{ item.name }}
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <v-text-field
          outlined
          color="secondary"
          type="number"
          step="1"
          min="1"
          label="Parcela"
          v-model="form.parts"
          placeholder="Parcela"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-text-field
          outlined
          color="secondary"
          type="number"
          step="0.01"
          min="0"
          label="Valor"
          v-model="form.value"
          placeholder="Valor"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="1">
        <v-btn icon class="mb-6" @click="add">
          <v-icon> mdi-plus-circle </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { PaymentMethod } from '@/models'

export default Vue.extend({
  props: {
    total: {
      type: Number,
      required: true,
    },
  },
  computed: {
    subTotal(): number {
      return 0.0
    },
    change(): number {
      return 0.0
    },
  },
  data() {
    return {
      paymentMethods: [
        {
          name: 'Cartão de crédito',
          code: 'CREDIT_CARD',
        },
        {
          name: 'Cartão de débito',
          code: 'DEBIT_CARD',
        },
        {
          name: 'Dinheiro',
          code: 'CASH',
        },
      ],
      form: {
        paymentMethod: {
          name: 'Cartão de crédito',
          code: 'CREDIT_CARD',
        } as PaymentMethod,
        parts: 1,
        value: 0.0,
      },
    }
  },
  methods: {
    add() {
      this.$emit('add', this.form)
    },
  },
})
</script>

<style lang="scss" scoped></style>
