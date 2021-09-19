<template>
  <v-row>
    <v-col cols="12" sm="12" class="mb-8">
      <h1 class="title text-h4">Welcome, {{ username }}</h1>
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <IndicadorUsers />
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <IndicadorSuppliers />
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <IndicadorProducts />
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <IndicadorCategories />
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="3">
      <ProductsByCategory />
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="3">
      <ProductsByProvider />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { $axios } from '@/utils/nuxt-instance'
import { 
  CardIndicador, 
  ProductsByCategory,
  IndicadorUsers,
  IndicadorSuppliers,
  IndicadorProducts,
  IndicadorCategories,
  ProductsByProvider
} from '@/components/atoms'

export default Vue.extend({
  components: {
    CardIndicador,
    ProductsByCategory,
    ProductsByProvider,
    IndicadorUsers,
    IndicadorSuppliers,
    IndicadorProducts,
    IndicadorCategories
  },
  data() {
    return {
      loading: false,
      username: '',
      categoryAmount: 0,
    }
  },
  methods: {
    find() {
      this.loading = true
      $axios
        .$get(`/api/users/myself`)
        .then((r) => {
          this.loading = false
          this.username = r.user.name
        })
        .catch((error) => {
          this.loading = false
        })
    },
    findCategoryAmount() {
      this.loading = true
      $axios
        .$get(`/api/categories/count`)
        .then((r) => {
          this.loading = false
          this.categoryAmount = r.amount
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
  created() {
    this.find()
    this.findCategoryAmount()
  },
})
</script>

<style lang="scss" scoped>
</style>
