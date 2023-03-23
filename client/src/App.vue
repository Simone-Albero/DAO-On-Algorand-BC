<template>
  
  <Navbar class="fixed-top"></Navbar>
  
  <div class="col p-0" id="container">
    <div class="row m-0" id="content">
      <div class="col-sm-auto p-0" id="sidebar-content"><Sidebar class="" id="sidebar"></Sidebar></div>
      <div class="col p-0"><router-view/></div>
    </div>

  </div>


</template>

<script>
import store from './store/store' 
import Sidebar from './components/base/Sidebar.vue'
import Navbar from './components/base/Navbar.vue'
import Footer from './components/base/Footer.vue'

export default {
  components: {
    Sidebar,
    Navbar,
    Footer,
  },

  mounted(){
    // On every page refresh
    this.$peraWallet.reconnectSession()
      .then((accounts) => {
      // Setup the disconnect event listener
      peraWallet.connector?.on("disconnect", () => {
        this.$peraWallet.disconnect();
        Store.commit('logout');
        this.$router.push({name: 'about'});
      });

      if (accounts.length) {
        store.commit('login', accounts[0])
      }
    });
  }
}
</script>

<style scoped>
  #container{
	  background-color: rgb(240, 240, 240);
  }

  #sidebar{
    position: sticky;
    top: 6vh;
    min-height: 94vh;
    max-width: 14rem;
    z-index: 1;
  }

  #content{
    min-height: 100vh;
  }

</style>
