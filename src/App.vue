<template>
  <div id="app">
    <div id="nav">
      <div class="container nav-container">
        <a href="javascript:;" v-on:click="handleClick">Login</a>
      </div>
    </div>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleClick: function() {
      alert(1);
    }
  }
}
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
</style>
