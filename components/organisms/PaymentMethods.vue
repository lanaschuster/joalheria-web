<template>
  <v-dialog persistent v-model="isActive" v-if="isActive" width="80%">
    <v-card>
      <v-card-title class="text-h5">
        Escolha o método de pagamento
      </v-card-title>

      <v-card-text class="mt-6">
        <v-row>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              outlined
              readonly
              x-large
              color="secondary"
              label="Total à pagar"
              class="total-input"
              prefix="R$ "
              v-model="total"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="3">
            <v-text-field
              outlined
              readonly
              x-large
              color="secondary"
              label="Troco"
              class="total-input"
              prefix="R$ "
              v-model="change"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="3">
            <v-text-field
              outlined
              readonly
              x-large
              color="secondary"
              label="Subtotal"
              class="total-input"
              prefix="R$ "
              :value="subtotal.toFixed(2)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <PaymentMethodForm :total="total" @add="addPaymentMethod($event)" />
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Opções</th>
                    <th class="text-left">Método</th>
                    <th class="text-left">Parcelas</th>
                    <th class="text-left">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in payments" :key="`payment_${i}`">
                    <td>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            icon
                            small
                            @click="payments.splice(i, 1)"
                          >
                            <v-icon color="error">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Excluir item</span>
                      </v-tooltip>
                    </td>
                    <td>{{ item.paymentMethod.name }}</td>
                    <td>{{ item.parts + 'x' }}</td>
                    <td>{{ 'R$ ' + item.value }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="cancel">
          Cancelar
        </v-btn>
        <v-btn
          color="success"
          text
          @click="$emit('realizarPagamento', paymentMethod)"
        >
          Realizar pagamento
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { PaymentMethod, Payment } from '@/models'
import { PaymentMethodForm } from '../molecules'

export default Vue.extend({
  components: {
    PaymentMethodForm,
  },
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    total: {
      type: Number,
      default: 129.89,
    },
  },
  computed: {
    pago(): number {
      const sum = (acc: number, curr: Payment) => acc + +curr.value
      return this.payments.reduce(sum, 0)
    },
    subtotal(): number {
      const subtotal = +this.total - +this.pago
      return subtotal < 0 ? 0 : subtotal
    },
    change(): number {
      const subtotal = this.pago - this.total
      return subtotal > 0 ? subtotal : 0
    }
  },
  data() {
    return {
      paymentMethod: {} as PaymentMethod,
      paymentMethods: [
        {
          name: 'Dinheiro',
          code: 'DINHEIRO',
        },
        {
          name: 'Cartão de crédito',
          code: 'CREDITO',
        },
        {
          name: 'Cartão de débito',
          code: 'DEBITO',
        },
      ] as PaymentMethod[],
      payments: [] as Payment[],
    }
  },
  methods: {
    addPaymentMethod(payment: Payment) {
      this.payments.push({ ...payment })
    },
    cancel() {
      this.$emit('cancelar')
    },
    pay() {
      this.payments.forEach(payment => {
        // TODO executar meio de pagamento
      })
    }
  },
})
</script>

<style lang="scss" scoped>
::v-deep .total-input .v-text-field__slot input {
  font-size: 48px;
  height: 48px;
  max-height: 48px;
  text-align: right;
}
::v-deep .total-input .v-text-field__slot {
  height: 100px;
  max-height: 100px;
}
</style>
