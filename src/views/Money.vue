<template>
  <div class="money">
    <h1>Money</h1>
    <month-selector :value="mm" @input="handleMonthInput"></month-selector>
    <div class='table-container'>
      <table>
        <thead>
          <tr>
            <th>DATE</th>
            <th>FROM</th>
            <th>TO</th>
            <th>TARGET</th>
            <th>MEMO</th>
            <th>AMOUNT</th>
            <th width="83"><button @click="handleAddNewLine">+</button></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(l, idx) in lines" :key="idx" :class="l.isSaved ? 'saved' : 'editing'">
            <td>
              <input type="date" class="no-border" v-model="l.date" @input="handleChanged(idx)">
            </td>
            <td>
              <input type="text" class="no-border" list="categories" v-model="l.from" @input="handleChanged(idx)">
            </td>
            <td>
              <input type="text" class="no-border" list="categories" v-model="l.to" @input="handleChanged(idx)">
            </td>
            <td>
              <input type="text" class="no-border" v-model="l.target" @input="handleChanged(idx)">
            </td>
            <td>
              <input type="text" class="no-border" v-model="l.memo" @input="handleChanged(idx)">
            </td>
            <td>
              <input type="text" class="no-border right-align" v-model="l.amount" @input="handleChanged(idx)">
            </td>
            <td>
              <button @click="handleSave(idx)">Save</button>
              <button @click="handleDelete(idx)">Del</button>
            </td>
          </tr>
        </tbody>
      </table>
      <datalist id="categories">
        <option v-for="c in categories" :key="c" :value="c"/>
      </datalist>
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
      categories: null,
      lines: [],
    };
  },
  computed: {
    uid() {
      return localStorage.uid;
    },
  },
  async created() {
    this.mm = moment().startOf('month').toDate();
    // load category
    const db = this.$firebase.firestore();
    const snapshot = await db.collection('categories').where('author', '==', this.uid).get();
    const arr = ['수입'];
    snapshot.forEach((doc) => {
      if (doc.data().types) {
        arr.push(...doc.data().types);
      }
    });
    this.categories = arr;
    this.load();
  },
  components: {
    'month-selector': MonthSelector,
  },
  methods: {
    load() {
      // load target month's data
      this.lines = [];
      const db = this.$firebase.firestore();
      const id = this.uid.substr(0, 12) + moment(this.mm).format('YYYYMM');
      db.collection('money').doc(id).get().then(snapshot => {
        this.lines = snapshot.data().lines;
      }).catch(e => {

      });
    },
    handleMonthInput(val) {
      this.mm = val;
      this.load();
    },
    handleChanged(idx) {
      this.lines[idx].isSaved = false;
    },
    handleAddNewLine() {
      // check editing line
      const cnt = this.lines.filter(l => !l.isSaved).length;
      if (cnt <= 0) {
        this.lines.push({
          isSaved: false,
          date: moment().format('YYYY-MM-DD'),
        });
      }
    },
    handleSave(idx) {
      // check input data
      const targetData = this.lines[idx];
      // Already saved data
      if (targetData.isSaved) {
        return;
      }
      if (moment(targetData.date).startOf('month').format() !== moment(this.mm).format()) {
        console.log(moment(targetData.date).startOf('month'), moment(this.mm));
        alert('Check Date!');
        return;
      }
      if (targetData.date == null) {
        alert('Check Date!');
        return;
      }
      if (targetData.from == null && targetData.to == null) {
        alert('Check From and To');
      }
      if (targetData.amount == null) {
        this.lines[idx].amount = 0;
      }

      // save
      this.lines[idx].isSaved = true;
      this.save();
    },
    handleDelete(idx) {
      if (window.confirm('Are you sure?')) {
        this.$delete(this.lines, idx);
        this.save();
      }
    },
    save() {
      const db = this.$firebase.firestore();
      const id = this.uid.substr(0, 12) + moment(this.mm).format('YYYYMM');
      db.collection('money').doc(id).set({
        author: this.uid,
        lines: this.lines,
      });
    }
  },
};
</script>
<style scoped>
.table-container {
  margin-top: 12px;
}
table {
  width: 100%;
  border: solid gray 1px;
}
tr.editing {
  background-color: #ffcccc;
}
th, td {
  border: solid 1px gray;
  padding: 1px;
  height: 26px;
}
input.no-border {
  border: none;
  width: 100%;
  height: 100%;
  background-color: transparent;
}
input.right-align {
  text-align: right;
}
</style>
