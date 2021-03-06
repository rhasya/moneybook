<template>
  <div class="money">
    <h1>Money</h1>
    <month-selector :value="mm" @input="handleMonthInput"></month-selector>
    <quick-box @input="handleQuick"></quick-box>
    <div class='table-container'>
      <table>
        <thead>
          <tr>
            <th scope="col">DATE</th>
            <th scope="col">FROM</th>
            <th scope="col">TO</th>
            <th scope="col">TARGET</th>
            <th scope="col">MEMO</th>
            <th scope="col">AMOUNT</th>
            <th width="83" scope="col"><button @click="handleAddNewLine">+</button></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(l, idx) in lines" :key="idx" :class="l.isSaved ? 'saved' : 'editing'">
            <td>
              <input type="date" class="no-border" v-model="l.date"
                  @input="handleChanged(idx)">
            </td>
            <td>
              <input type="text" class="no-border" list="categories" v-model="l.from"
                  @input="handleChanged(idx)">
            </td>
            <td>
              <input type="text" class="no-border" list="categories" v-model="l.to"
                  @input="handleChanged(idx)">
            </td>
            <td>
              <input type="text" class="no-border" v-model="l.target"
                  @input="handleChanged(idx)">
            </td>
            <td>
              <input type="text" class="no-border" v-model="l.memo"
                  @input="handleChanged(idx)">
            </td>
            <td>
              <input type="number" class="no-border right-align" v-model.number="l.amount"
                  @input="handleChanged(idx)" lang="ko">
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
import QuickBox from '../components/QuickBox.vue';

export default {
  name: 'money',
  data() {
    return {
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
    const doc = await db.collection('categories').doc(this.uid.substr(0, 20)).get();

    const arr = ['수입'];
    doc.data().names.forEach((cat) => {
      arr.push(...cat.subNames);
    });
    this.categories = arr;

    // load moneybook
    this.load();
  },
  components: {
    'month-selector': MonthSelector,
    'quick-box': QuickBox,
  },
  methods: {
    async load() {
      // load target month's data
      this.lines = [];

      const id1 = this.uid.substr(0, 20);
      const id2 = moment(this.mm).format('YYYYMM');

      const db = this.$firebase.firestore();
      try {
        const doc = await db.collection('money').doc(id1).collection('month').doc(id2)
          .get();

        if (doc.exists) {
          // console.log(doc.data());
          this.lines = doc.data().lines;
        }
      } catch (e) {
        // do nothing
        console.error(e);
      }
    },
    save() {
      const id1 = this.uid.substr(0, 20);
      const id2 = moment(this.mm).format('YYYYMM');

      let newLines = this.lines.map(l => ({
        ...l,
        amount: parseInt(l.amount, 10),
        isSaved: true,
      }));
      newLines = newLines.sort((a, b) => {
        let r = 0;
        if (a.date < b.date) {
          r = -1;
        } else if (a.date > b.date) {
          r = 1;
        }
        return r;
      });

      const data = {
        lines: newLines,
      };

      const db = this.$firebase.firestore();
      db.collection('money').doc(id1).collection('month').doc(id2)
        .set(data);
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
      let newDate = moment().format('YYYY-MM-DD');
      if (this.lines.length > 0) {
        newDate = this.lines[this.lines.length - 1].date;
      }
      if (cnt <= 0) {
        this.lines.push({
          isSaved: false,
          date: newDate,
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
      // this.$set(this.lines, idx, this.lines[idx]);
      this.save();
    },
    handleDelete(idx) {
      if (window.confirm('Are you sure?')) {
        this.$delete(this.lines, idx);
        this.save();
      }
    },
    handleQuick(val) {
      val.isSaved = false;
      this.lines.push(val);
    },
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
input[type=number] {
  appearance: textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button,
input[type=date]::-webkit-inner-spin-button,
input[type=date]::-webkit-outer-spin-button {
  appearance: none;
}
</style>
