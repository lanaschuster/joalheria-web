<template>
  <v-card elevation="4" height="100%" :style="{'--primary': $vuetify.theme.themes.light.primary}">
    <v-card-title class="title overline">Top selling jewels</v-card-title>
    <v-card-text>
      <div
        v-for="(jewel, i) in jewels"
        :key="`jewel_${i}`"
        style="height: 100%"
        class="mb-4 chip d-flex align-center justify-space-between"
      >
        <div class="d-flex align-center">
          <div
            class="product-img"
            :style="{
              'background': `url(${url(jewel.image)}) no-repeat`,
              'background-size': 'cover',
              'background-position': 'center'
            }"
          ></div>
          <span>
            {{ jewel.name }}
          </span>

        </div>
        <span>
          <strong>{{ jewel.qty }} Sold</strong>
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { $axios } from '@/utils/nuxt-instance'
import { CardIndicador } from '@/components/atoms'

export default Vue.extend({
  components: {
    CardIndicador,
  },
  data() {
    return {
      loading: false,
      jewels: []
    }
  },
  methods: {
    url(img: String): String {
      return `${process.env.apiUrl}/${img}`
    },
    count() {
      this.loading = true
      $axios
        .$get(`/api/products/best-selling`)
        .then((r) => {
          this.loading = false
          this.jewels = r
          console.log(this.jewels)
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
  created() {
    this.count()
  },
})
</script>

<style scoped>
.product-img {
  height: 3rem;
  width: 3rem;
  border-radius: 4px;
  margin-right: 1rem;
}
.chip {
  border-radius: 4px;
  padding: 4px .8rem;
}
.chip:hover {
  background-color: #efefef;
  border-radius: 0px;
}
.chip span {
  word-break: initial;
  /* padding-right: 1px; */
}
::v-deep .v-chip__content {
  width: 100%;
  padding: 4px;
  display: flex;
  justify-content: space-between;
}
@media screen and (max-width: 1700px) {
  ::v-deep .v-chip__content {
    flex-direction: column;
    align-items: start;
    height: fit-content;
  }
}
@media screen and (max-width: 300px) {
  .product-img {
    display: none;
  }
}

</style>
