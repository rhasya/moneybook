<template>
  <div class="quick-box">
    <label for="quick-box">QuickBox</label>
    <input id="quick-box" size="120" v-model="myValue" autocomplete="off">
    <button @click="handleClick">저장</button>
  </div>
</template>
<script>
export default {
  name: 'quick-box',
  data() {
    return {
      myValue: '',
    };
  },
  props: [
    'value',
  ],
  created() {
    this.myValue = this.$props.value;
  },
  methods: {
    handleClick() {
      // proc parse
      const rawData = this.myValue.split('\t');
      this.myValue = '';
      const obj = {
        date: rawData[0],
        from: rawData[3],
        to: rawData[1],
        target: rawData[4],
        memo: rawData[5],
        amount: parseInt(rawData[6].replace(/[₩,]/g, ''), 10),
      };
      this.$emit('input', obj);
    },
  },
};
</script>
