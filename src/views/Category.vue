<template>
  <div class="category">
    <h1>Category!</h1>
    <div>
      <input type="text" v-model="categoryName">
      <button @click="handleNewCategory">New Category</button>
    </div>
    <div>
      <ul>
        <li v-for="c in categories" v-bind:key="c.key">{{ c.name }}</li>
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
    getList() {
      const db = this.$firebase.firestore();
      db.collection('categories').where('author', '==', this.getUid()).get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            this.categories.push({ key: doc.id, ...doc.data() });
            console.log(doc.id, '=>', doc.data());
          });
        })
        .catch((e) => {
          console.error(e);
        });
    },
    handleNewCategory() {
      const db = this.$firebase.firestore();
      db.collection('categories').add({
        name: this.categoryName,
        author: this.getUid(),
      })
        .then((docRef) => {
          console.log(docRef.id);
          this.categoryName = '';
          this.getList();
        })
        .catch((e) => { console.error(e); });
    },
  },
};
</script>
