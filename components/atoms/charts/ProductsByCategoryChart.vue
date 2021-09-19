<template>
  <client-only>
    <v-card elevation="4">
      <v-card-title class="title overline"> Products by Category </v-card-title>
      <v-card-content style="padding: 4px">
        <PieChart v-if="show" :data="pieData" :options="pieOpt" />
      </v-card-content>
    </v-card>
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue'
import { $axios } from '@/utils/nuxt-instance'
import { CardIndicador, PieChart } from '@/components/atoms'

export default Vue.extend({
  components: {
    CardIndicador,
    PieChart,
  },
  data() {
    return {
      show: false,
      loading: false,
       pieData: {
        labels: [] as string[],
        datasets: [
          {
            label: 'Dataset 1',
            data: [] as number[],
            backgroundColor: [] as string[],
          }
        ]
      },
      pieOpt: {
        responsive: true,
        plugins: {
          legend: {
            position: 'left',
          },
          title: {
            display: true,
            text: 'Products by Category'
          }
        }
      },
      colors: [
        '#cb997e', 
        '#ddbea9', 
        '#ffe8d6', 
        '#b7b7a4', 
        '#a5a58d', 
        '#6b705c',
        '#797d62',
        '#eddcd2',
        '#fff1e6',
        '#f0efeb',
        '#ddbea9',
        '#a5a58d',
        '#b7b7a4',
      ]
    }
  },
  async mounted() {
    await this.countProductByCategoryId()
    this.show = true
  },
  methods: {
    async countProductByCategoryId() {
      this.loading = true
      await $axios
        .$get(`/api/products/count/categories`)
        .then((r) => {
          this.loading = false
          const mn = 0
          const mx = this.colors.length - 1

          r.forEach((item: { name: string, qty: number }) => {
            let index = Math.floor(Math.random() * (mx - mn) + mn)
            this.pieData.labels.push(`${item.name}: ${item.qty}`)
            this.pieData.datasets[0].data.push(item.qty)
            this.pieData.datasets[0].backgroundColor.push(this.colors[index])
          })
        })
        .catch((error) => {
          this.loading = false
        })
    },
  }
})
</script>

<style lang="scss" scoped>
</style>
