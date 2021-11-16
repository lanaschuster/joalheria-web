<template>
  <div class="header">
    <div class="titles d-flex flex-column">
      <h1 class="title text-h4 mb-2 fw-500">{{ title }}</h1>
      <h4 class="subtitle text-subtitle-1 mb-8">{{ subtitle }}</h4>
    </div>
    <v-btn
      v-if="isListMode && canAdd"
      @click="$emit('add')" 
      color="success" 
      class="add-btn"> 
      <v-icon small>mdi-plus</v-icon>
      Add
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    isListMode: {
      type: Boolean,
      required: true
    },
    canAdd: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
}
.add-btn {
  text-transform: initial;
}
@media screen and (max-width: 400px) {
  .header {
    flex-direction: column;
  }
}
</style>
