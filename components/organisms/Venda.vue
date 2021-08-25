<template>
  <div class="component">
    <h1 class="title text-h4 mb-6">Venda</h1>
    <v-row v-if="!goToList">
      <v-col cols="12" sm="12" md="12">
        <img
          :src="'/banner/nova_compra_banner.jpg'"
          alt="Bem-vindo"
          class="img"
        />
        <v-text-field
          outlined
          autofocus
          class="mt-4"
          color="secondary"
          label="CPF do Cliente"
          v-mask="'###.###.###-##'"
          v-model="cpf"
          @keyup.enter="goToPurchaseList"
          placeholder="Tecle Enter para prosseguir..."
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-text-field
          outlined
          readonly
          x-large
          color="secondary"
          label="Produto"
          class="product-input"
          :value="productDescription"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <v-text-field
          outlined
          x-large
          color="secondary"
          class="input"
          label="Código"
          v-model="currentProduct.code"
        ></v-text-field>
        <v-text-field
          outlined
          x-large
          color="secondary"
          class="input"
          label="Quantidade"
          type="number"
          min="0"
          step="0.01"
          v-model="currentProduct.quantity"
        ></v-text-field>
        <v-text-field
          outlined
          x-large
          readonly
          color="secondary"
          class="input"
          label="Valor Unitário"
          type="number"
          min="0"
          step="0.01"
          prefix="R$"
          v-model="currentProduct.unitValue"
        ></v-text-field>
        <v-text-field
          outlined
          x-large
          readonly
          color="secondary"
          class="input"
          label="Valor Total"
          type="number"
          min="0"
          step="0.01"
          prefix="R$"
          v-model="currentProduct.total"
        ></v-text-field>
        <v-divider></v-divider>
        <v-text-field
          outlined
          x-large
          readonly
          class="mt-10 total-input"
          height="100px"
          color="secondary"
          label="Total"
          type="number"
          min="0"
          step="0.01"
          prefix="R$"
          v-model="total"
        ></v-text-field>
        <div class="d-flex justify-space-between">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon small @click="cancelarVenda">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Cancelar venda</span>
          </v-tooltip>
          <v-btn outlined color="success" @click="showPaymentMethods = true">
            Finalizar compra
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="9">
        <v-card outlined height="100%">
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Código</th>
                    <th class="text-left">Produto</th>
                    <th class="text-left">Qtd.</th>
                    <th class="text-left">Und.</th>
                    <th class="text-left">Valor unitário</th>
                    <th class="text-left">Valor Total</th>
                    <th class="text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in itensVenda" :key="item.name">
                    <td>{{ item.code }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.quantity.toFixed(2) }}</td>
                    <td>{{ item.unit }}</td>
                    <td>{{ 'R$ ' + item.unitValue.toFixed(2) }}</td>
                    <td>{{ 'R$ ' + item.total.toFixed(2) }}</td>
                    <td>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" v-on="on" icon small>
                            <v-icon color="error">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Excluir item</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      cpf: '',
      goToList: true,
      isVendaCancelada: false,
      showPaymentMethods: false,
      itensVenda: [
        {
          name: 'Maçã verde',
          code: '0000001250',
          description: 'maçã verde',
          quantity: 2,
          unit: 'KG',
          unitValue: 0.5,
          total: 1,
        },
      ],
      currentProduct: {
        name: 'Maçã verde',
        code: '0000001250',
        description: 'Maçã verde',
        quantity: 2,
        unit: 'KG',
        unitValue: 0.5,
        total: 1,
      },
      paymentMethod: {},
    }
  },
  methods: {
    goToPurchaseList() {
      this.goToList = true
      // TODO
    },
    cancelarVenda() {
      this.$router.push('caixa')
      this.$store.dispatch('setMessage', 'Venda Cancelada')
      this.$store.dispatch('setSnackbar', true)
    },
    // realizarPagamento(paymentMethod) {
    //   console.log(paymentMethod)
    // },
    cancelarPaymentMethod() {
      this.showPaymentMethods = false
      this.paymentMethod = {}
    }
  },
  computed: {
    productDescription(): string {
      return `${this.currentProduct.description} ${this.currentProduct.unit}`
    },
    total(): number {
      return 12.99
    },
  },
})
</script>

<style lang="scss" scoped>
.img {
  border-radius: 15px;
  height: 74vh;
  width: 100%;
}
::v-deep .product-input .v-text-field__slot input {
  font-size: 68px;
  height: 68px;
  max-height: 68px;
}
::v-deep .product-input .v-text-field__slot {
  height: 100px;
  max-height: 100px;
}
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
::v-deep .input .v-text-field__slot input {
  text-align: right;
}
</style>
