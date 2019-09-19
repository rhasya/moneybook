<template>
  <div class="category">
    <h1>Category</h1>
    <div>
      <input type="text" v-model="categoryName">
      <button @click="handleNewCategory">New Category</button>
    </div>
    <div>
      <ul>
        <li v-for="(c, idx) in categories" v-bind:key="c.key">
          <span>{{ c.name }}</span>
          <button @click="handleDelete(c.key)">삭제</button>
          <button @click="handleAppendCategory(idx)">추가</button>
          <ul>
            <li v-for="t in c.types" v-bind:key="t">{{ t }}</li>
            <li v-if="c.show">
              <input type="text" v-model="c.subName">
              <button @click="handleSubCategory(c)">저장</button>
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
    // todo: get category list
    this.getList();
  },
  methods: {
    getUid() {
      return localStorage.uid;
    },
    async getList() {
      const db = this.$firebase.firestore();
      const snapshot = await db.collection('categories').where('author', '==', this.getUid()).get();

      const cats = [];
      snapshot.forEach((doc) => {
        cats.push({ key: doc.id, subName: '', ...doc.data() });
        // console.log(doc.id, '=>', doc.data());
      });
      cats.sort((a, b) => (a.created_at - b.created_at));
      this.categories = cats;
    },
    async handleNewCategory() {
      const db = this.$firebase.firestore();
      await db.collection('categories').add({
        name: this.categoryName,
        created_at: Date.now(),
        author: this.getUid(),
      });

      this.categoryName = '';
      this.getList();
    },
    async handleDelete(key) {
      if (window.confirm('Are you sure?')) {
        const db = this.$firebase.firestore();
        await db.collection('categories').doc(key).delete();
        this.getList();
      }
    },
    handleAppendCategory(idx) {
      const obj = this.categories[idx];
      obj.show = !obj.show;
      this.$set(this.categories, idx, obj);
    },
    async handleSubCategory(obj) {
      if (!obj.types) {
        obj.types = [];
      }
      obj.types.push(obj.subName);

      // Save data to db
      const db = this.$firebase.firestore();
      await db.collection('categories').doc(obj.key).set({
        author: obj.author,
        created_at: obj.created_at,
        updated_at: Date.now(),
        name: obj.name,
        types: obj.types,
      });
      this.getList();
    },
  },
};
</script>
