<template>
  <div class="my-container">
    <h1 class="title text-h4 fw-500 mb-8">Dashboard</h1>

    <div class="wrapper indicador-wrapper">
      <IndicadorSales class="indicador" />
      <IndicadorCanceledSales class="indicador" />
      <IndicadorProducts class="indicador" />
      <IndicadorSuppliers class="indicador" />
      <IndicadorCategories class="indicador" />
      <IndicadorUsers class="indicador" />
    </div>
    <div class="wrapper grafico-wrapper">
      <MostRecentSales class="grafico" />
      <BestSellingProducts class="grafico" />
      <ProductsByCategory />
      <ProductsByProvider />
    </div>
  </div>
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
  IndicadorSales,
  IndicadorCanceledSales,
  ProductsByProvider,
  MostRecentSales,
  BestSellingProducts
} from '@/components/atoms'

export default Vue.extend({
  components: {
    CardIndicador,
    ProductsByCategory,
    ProductsByProvider,
    IndicadorUsers,
    IndicadorSuppliers,
    IndicadorProducts,
    IndicadorCategories,
    IndicadorSales,
    IndicadorCanceledSales,
    MostRecentSales,
    BestSellingProducts
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

<style scoped>
.my-container {
  padding: 2rem 0 4rem;
}
.wrapper {
  margin-bottom: 2rem;
  max-width: 100%;
  width: 100%;
}
.grafico {
  max-width: 100%;
  width: 100%;
}
.indicador-wrapper {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(6, 1fr);
}
.grafico-wrapper {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(4, 23.7%);
}

@media screen and (min-width: 1025px) and (max-width: 1260px){
  .grafico-wrapper {
    grid-template-columns: repeat(2, 48%);
  }
}
@media screen and (min-width: 569px) and (max-width: 1024px){
  .indicador-wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
  .grafico-wrapper {
    grid-template-columns: repeat(2, 48%);
  }
}
@media screen and (min-width: 401px) and (max-width: 568px){
  .indicador-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
  .grafico-wrapper {
    grid-template-columns: repeat(1, 100%);
  }
}
@media screen and (max-width: 400px){
  .indicador-wrapper {
    grid-template-columns: repeat(1, 1fr);
  }
  .grafico-wrapper {
    grid-template-columns: repeat(1, 100%);
  }
}
</style>
