<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // debugger
    const redirect=window.localStorage.getItem("redirect")
    if (redirect) {
      this.$store.commit({
        type:"settings/STORE_REDIRECT",
        redirect:redirect
      })
    }
  }
}

</script>
<style>
body{
  background-color: #efefef;
}
</style>
