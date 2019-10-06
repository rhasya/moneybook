<template>
  <div class="plan-month">
    <table>
      <caption>{{ monthStr }}</caption>
      <thead>
        <tr>
          <th class="th1"></th>
          <th class="th2">LAST MONTH</th>
          <th class="th3">PLAN</th>
          <th class="th4">THIS MONTH</th>
          <th class="th4">REMAIN</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(v, k) in data" :key="k" :class="'level' + v.level">
          <th :data-level="v.level">{{ v.name }}</th>
          <td class="right-align"></td>
          <td class="right-align"></td>
          <td class="right-align">{{ v.thisMonth }}</td>
          <td class="right-align"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import * as moment from 'moment';

import firebase from '../firebase';

export default {
  name: 'plan-month',
  data() {
    return {
      data: {},
    };
  },
  props: [
    'month',
  ],
  computed: {
    uid() {
      return localStorage.uid;
    },
    monthStr() {
      return moment(this.month).format('YYYY/MM');
    },
  },
  watch: {
    month(val) {
      this.load(val);
    },
  },
  created() {
    this.load(this.month);
  },
  methods: {
    async load() {
      const newData = { 수입: { name: '수입', level: 1 } };

      const db = firebase.firestore();
      const cats = await db.collection('categories').doc(this.uid.substr(0, 20)).get();

      cats.data().names.filter(this.notAccount).forEach((c) => {
        newData[c.name] = { name: c.name, level: 0 };
        c.subNames.forEach((s) => {
          newData[s] = { name: s, level: 1, canEdit: c.canDelete };
        });
      });

      // GET PLAN
      try {
        const plans = await db.collection('plan').doc(this.uid.substr(0, 20)).get();
        console.log(plans.data());
      } catch (e) {
        // do nothing
      }

      // GET LINES
      try {
        const doc = await db.collection('money').doc(this.uid.substr(0, 20)).collection('month')
          .doc(moment(this.month).format('YYYYMM'))
          .get();

        if (doc.exists) {
          const { lines } = doc.data();
          Object.entries(newData).forEach(([k, v]) => {
            if (v.level !== 1) return;
            // make sum of lines data
            const aOut = lines.filter(l => l.to === k)
              .reduce((prev, l) => (prev + parseInt(l.amount, 10)), 0);
            const aIn = lines.filter(l => l.from === k)
              .reduce((prev, l) => (prev + parseInt(l.amount, 10)), 0);
            newData[k].thisMonth = aOut;
            newData[k].thisIn = aIn;
          });
        }
      } catch (e) {
        // do nothing
        console.error(e);
      }

      this.data = newData;
    },
    notAccount(v) {
      return ['계좌', '카드', '대출'].every(a => a !== v.name);
    },
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
  width: 88px;
}
div.plan-month thead th.th2 {
  width: 88px;
}
div.plan-month thead th.th3 {
  width: 88px;
}
div.plan-month thead th.th4 {
  width: 88px;
}
div.plan-month tbody tr.level0 {
  background-color: lightgreen;
}
div.plan-month tbody th[data-level="1"] {
  font-weight: normal;
}
.right-align {
  text-align: right;
}
</style>
