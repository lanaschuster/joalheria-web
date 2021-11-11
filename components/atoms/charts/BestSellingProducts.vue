<template>
  <v-card elevation="4" height="100%" :style="{'--primary': $vuetify.theme.themes.light.primary}">
    <v-card-title class="title overline">Best selling jewels</v-card-title>
    <v-card-text>
      <div
        v-for="(jewel, i) in jewels"
        :key="`jewel_${i}`"
        style="height: 100%"
        class="mb-4 d-flex justify-space-between chip"
      >
        <span>
          {{ jewel.name }}
        </span>
        <div><strong>Sold:</strong> {{ jewel.qty }}</div>
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
    count() {
      this.loading = true
      $axios
        .$get(`/api/products/best-selling`)
        .then((r) => {
          this.loading = false
          this.jewels = r
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
.chip {
  background-color: var(--primary);
  color: #FFF;
  border-radius: 4px;
  padding: 4px .8rem;
}
.chip span {
  word-break: initial;
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
</style>
