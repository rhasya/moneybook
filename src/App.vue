<template>
  <div id="app">
    <div id="nav">
      <div class="container nav-container">
        <span>{{ this.$store.state.email }}</span>
        <a href="javascript:;" v-on:click="handleClick">{{ this.$store.state.btnName }}</a>
      </div>
    </div>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      provider: null,
    };
  },
  async created() {
    console.log(this);

    const provider = new this.$firebase.auth.GoogleAuthProvider();
    this.provider = provider;

    const user = this.$firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit('login', { email: user.email });
      }
      else {
        this.$store.commit('logout');
      }
    });
  },
  methods: {
    async handleClick() {
      if (this.$store.state.email) {
        await this.handleLogout();
      }
      else {
        await this.handleLogin();
      }
    },
    async handleLogin() {
      try {
        const result = await this.$firebase.auth().signInWithPopup(this.provider);
      } catch(e) {
        console.error(e);
      }
    },
    async handleLogout() {
      try {
        await this.$firebase.auth().signOut();
      } catch(error) {
        console.error(e);
      }
    },
  },
};
</script>
<style scoped>
#nav {
  height: 24px;
  background-color: black;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 1024px;
  color: white;
}
.nav-container a {
  color: white;
}
.nav-container a:visited {
  color: white;
}
.nav-container a:hover {
  color: yellow;
}
.nav-container span + a {
  margin-left: 10px;
}
</style>
