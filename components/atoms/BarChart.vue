<script>
import { Bar } from 'vue-chartjs'

export default {
  mixins: [ Bar ],
  props: [ 'data', 'options' ],
  mounted() {
    this.renderChart(this.data, this.options)
  },
}
</script>
