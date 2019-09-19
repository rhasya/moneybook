<template>
  <div class="month-selector">
    <button class="btn-left" @click="handleLeftClick">&lt;</button>
    <h2>{{ year }}년 {{ month }}월</h2>
    <button class="btn-right" @click="handleRightClick">></button>
  </div>
</template>
<script>
import * as moment from 'moment';

export default {
  name: 'month-selector',
  data() {
    return {
      now: null,
    };
  },
  props: [
    'value',
  ],
  computed: {
    year() {
      return moment(this.now).get('year');
    },
    month() {
      return moment(this.now).get('month') + 1;
    },
  },
  created() {
    if (this.$props.value) {
      this.now = this.$props.value;
    } else {
      this.now = moment().startOf('month').toDate();
    }
  },
  methods: {
    handleLeftClick() {
      if (moment(this.now) > moment('2001-01-31')) {
        this.now = moment(this.now).subtract(1, 'M').toDate();
        this.$emit('input', this.now);
      } else {
        alert('더 이상 앞으로 갈 수 없습니다.');
      }
    },
    handleRightClick() {
      if (moment(this.now) < moment('2099-12-01')) {
        this.now = moment(this.now).add(1, 'M').toDate();
        this.$emit('input', this.now);
      } else {
        alert('더 이상 뒤로 갈 수 없습니다.');
      }
    },
  },
};
</script>
<style scoped>
.month-selector {
  display: flex;
  justify-content: center;
}
.btn-left {
  margin-right: 20px;
}
.btn-right {
  margin-left: 20px;
}
</style>
