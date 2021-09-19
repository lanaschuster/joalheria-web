<script>
import { Pie, mixins } from 'vue-chartjs'

export default {
  mixins: [ Pie, mixins.reactiveData ],
  props: [ 'data', 'options' ],
  mounted() {
    this.renderChart(this.data, this.options)
  },
};
</script>
