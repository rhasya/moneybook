<template>
  <div id="app">
    <div id="nav">
      <div class="container">
        <div class="menu-container">
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/category">Category</router-link></li>
            <li><router-link to="/money">Money</router-link></li>
            <li><router-link to="/about">About</router-link></li>
          </ul>
        </div>
        <div class="login-container">
          <span>{{ $store.state.email }}</span>
          <a href="javascript:" @click="handleClick">{{ $store.state.btnName }}</a>
        </div>
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
    // Login
    this.provider = new this.$firebase.auth.GoogleAuthProvider();
    this.$firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit('login', { uid: user.uid, email: user.email });
      } else {
        this.$store.commit('logout');
        if (window.location.pathname !== '/') {
          this.$router.push('/');
        }
      }
    });
  },
  methods: {
    async handleClick() {
      if (this.$store.state.email) {
        await this.handleLogout();
      } else {
        await this.handleLogin();
      }
    },
    async handleLogin() {
      try {
        await this.$firebase.auth().signInWithPopup(this.provider);
      } catch (e) {
        console.error(e);
      }
    },
    async handleLogout() {
      try {
        await this.$firebase.auth().signOut();
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
<style scoped>
#nav {
  height: 36px;
  background-color: black;
}

#nav .container {
  width: 1024px;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

#nav ul {
  list-style: none;
  padding: 0;
  display: flex;
}

#nav ul li {
  color: white;
}

#nav ul li + li {
  margin-left: 16px;
}

.menu-container {
  display: flex;
  height: 100%;
  align-items: center;
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: white;
  height: 100%;
}
#nav a {
  color: white;
}
#nav a:visited {
  color: white;
}
#nav a:hover {
  color: yellow;
}
.login-container span + a {
  margin-left: 10px;
}
div.container {
  margin-bottom: 31px !important;
}
</style>
