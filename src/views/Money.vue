<template>
  <div class="money">
    <h1>Money</h1>
    <month-selector :value="mm" @input="handleMonthInput"></month-selector>
    <div>

    </div>
  </div>
</template>
<script>
import * as moment from 'moment';
import MonthSelector from '../components/MonthSelector.vue';

export default {
  name: 'money',
  data() {
    return {
      msg: 'Hello World!',
      mm: null,
    };
  },
  created() {
    this.mm = moment().startOf('month').toDate();
  },
  components: {
    'month-selector': MonthSelector,
  },
  methods: {
    handleMonthInput(val) {
      this.mm = val;
      console.log(moment(this.mm).format());
    },
    handleTest() {
      console.log(this.mm);
    },
  },
};
</script>
