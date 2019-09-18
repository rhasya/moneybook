<template>
  <div class="money">
    <h1>Money</h1>
    <MonthSelector></MonthSelector>
  </div>
</template>
<script>
import MonthSelector from '@/components/MonthSelector.vue';

export default {
  name: 'money',
  data() {
    return {
      msg: 'Hello World!',
    };
  },
  components: {
    MonthSelector: MonthSelector,
  }
};
</script>
