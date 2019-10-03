<template>
  <div class="plan-month">
    <table>
      <caption>{{ month.format('YYYY/MM') }}</caption>
      <thead>
        <tr>
          <th class="th1"></th>
          <th class="th2">LAST MONTH</th>
          <th class="th3">PLAN</th>
          <th class="th4">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in cats" :key="c.name">
          <th :data-level="c.level">{{ c.name }}</th>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import firebase from '../firebase';

export default {
  name: 'plan-month',
  data() {
    return {
      cats: [],
    };
  },
  props: [
    'month',
  ],
  computed: {
    uid() {
      return localStorage.uid;
    },
  },
  async created() {
    const db = firebase.firestore();
    const cats = await db.collection('categories').doc(this.uid.substr(0, 20)).get();

    this.cats = [];
    cats.data().names.forEach((c) => {
      this.cats.push({ name: c.name, level: 0 });
      c.subNames.forEach((s) => {
        this.cats.push({ name: s, level: 1 });
      });
    });
  },
};
</script>
<style scoped>
div.plan-month table {
  border: 1px solid lightgray;
}
div.plan-month table td,
div.plan-month table th {
  border: 1px solid lightgray;
  padding: 2px 0px;
}
div.plan-month table > caption {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}
div.plan-month thead th.th1 {
  width: 100px;
}
div.plan-month thead th.th2 {
  width: 100px;
}
div.plan-month thead th.th3 {
  width: 100px;
}
div.plan-month thead th.th4 {
  width: 100px;
}
div.plan-month tbody th[data-level="1"] {
  font-weight: normal;
}
</style>
