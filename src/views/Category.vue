<template>
  <div class="category">
    <h1>Category</h1>
    <div>
      <input type="text" v-model="categoryName">
      <button @click="handleNewCategory">New Category</button>
    </div>
    <div>
      <ul>
        <li v-for="(c, idx) in categories" :key="idx">
          <span>{{ c.name }}</span>
          <button @click="handleDelCat(idx)" v-if="c.canDelete">삭제</button>
          <button @click="handleAddCat(idx)">추가</button>
          <button @click="handleUpCat(idx)" v-if="idx !== 0">▲</button>
          <button @click="handleDownCat(idx)" v-if="idx !== categories.length - 1">▼</button>
          <ul>
            <li v-for="(s, idx2) in c.subNames" :key="s">
              <span>{{ s }}</span>
              <button @click="handleDelSub(idx, idx2)">삭제</button>
            </li>
            <li v-if="c.show">
              <input type="text" v-model="c.subName">
              <button @click="handleAddSub(idx)">저장</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'category',
  data() {
    return {
      list: [],
      categoryName: '',
      categories: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const db = this.$firebase.firestore();
      const doc = await db.collection('categories').doc(localStorage.uid.substr(0, 20)).get();
      this.categories = doc.data().names;
    },
    save() {
      const db = this.$firebase.firestore();
      db.collection('categories').doc(localStorage.uid.substr(0, 20)).set({
        author: localStorage.uid,
        names: this.categories,
      });
    },
    handleNewCategory() {
      const obj = { name: this.categoryName, subNames: [], canDelete: true };
      if (['계좌', '카드', '대출'].find(v => v === obj.name)) {
        obj.canDelete = false;
      }
      this.categories.push(obj);
      this.categoryName = '';

      this.save();
    },
    handleDelCat(idx) {
      if (window.confirm('Are you sure?')) {
        this.categories.splice(idx, 1);
        this.save();
      }
    },
    handleAddCat(idx) {
      const obj = this.categories[idx];
      obj.show = !obj.show;
      this.$set(this.categories, idx, obj);
    },
    handleUpCat(idx) {
      const tmp = this.categories[idx];
      this.$set(this.categories, idx, this.categories[idx - 1]);
      this.$set(this.categories, idx - 1, tmp);
      this.save();
    },
    handleDownCat(idx) {
      const tmp = this.categories[idx];
      this.$set(this.categories, idx, this.categories[idx + 1]);
      this.$set(this.categories, idx + 1, tmp);
      this.save();
    },
    handleAddSub(idx) {
      const obj = this.categories[idx];
      obj.subNames.push(obj.subName);
      delete obj.subName;
      delete obj.show;

      this.save();
    },
    handleDelSub(idx, idx2) {
      const obj = this.categories[idx];
      obj.subNames.splice(idx2, 1);

      this.save();
    },
  },
};
</script>
<style scoped>
li {
  line-height: 2em;
}
li > span {
  margin-right: 8px;
}
button + button {
  margin-left: 8px;
}
</style>
