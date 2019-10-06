<template>
  <div class="plan">
    <h1>Plan</h1>
    <div class="flex-row">
      <button class="left" @click="handleMove(-1)">&lt;</button>
      <plan-month :month="mm"></plan-month>
      <plan-month :month="mmNext"></plan-month>
      <button class="right" @click="handleMove(1)">&gt;</button>
    </div>
  </div>
</template>
<script>
import * as moment from 'moment';
import PlanMonth from '../components/PlanMonth.vue';

export default {
  name: 'plan',
  data() {
    return {
      mm: null,
      mmNext: null,
    };
  },
  components: {
    'plan-month': PlanMonth,
  },
  created() {
    this.mm = moment().startOf('M').toDate()
    this.mmNext = moment().startOf('M').add(1, 'M').toDate();
  },
  methods: {
    handleMove(n) {
      this.mm = moment(this.mm).add(n, 'M').toDate();
      this.mmNext = moment(this.mmNext).add(n, 'M').toDate();
    },
  },
};
</script>
<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
button.left, button.right {
  height: 32px;
}
</style>
