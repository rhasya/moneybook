<template>
  <div class="category">
    <h1>Category!</h1>
    <div>
      <input type="text" v-model="categoryName">
      <button @click="handleNewCategory">New Category</button>
    </div>
    <div>
      <ul>
        <li v-for="c in categories" v-bind:key="c.key">
          <span>{{ c.name }}</span>
          <button @click="handleDelete(c.key)">삭제</button>
          <button @click="handleAppendCategory">추가</button>
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
      return this.$firebase.auth().currentUser.uid;
    },
    async getList() {
      const db = this.$firebase.firestore();
      const snapshot = await db.collection('categories').where('author', '==', this.getUid()).get();

      const cats = [];
      snapshot.forEach((doc) => {
        cats.push({ key: doc.id, ...doc.data() });
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
      const db = this.$firebase.firestore();
      await db.collection('categories').doc(key).delete();
      this.getList();
    },
    handleAppendCategory() {
      // todo
    },
  },
};
</script>
