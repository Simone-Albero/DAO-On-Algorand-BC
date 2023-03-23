<template>
    <nav class="navbar shadow-sm navbar-light bg-white">
        <div class="d-flex flex-col">
            <button class="btn btn-sm pl-1 pr-1 pt-0 pb-0 mt-2 mb-2" @click="toggleSidebar" id="sidebar-button">
                <span class="navbar-toggler-icon"></span>
            </button>

            
            <h4 class="pt-2 b ml-4">
                <i class="bi bi-stack"></i>
                Daos
            </h4>

            <form class="form-inline my-2 my-lg-0">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn my-2 my-sm-0" type="submit" id="submit-btn">
                    <i class="bi bi-search"></i>
                </button>
            </form>
        </div>

        <router-link class="btn btn-outline-info float-right" id="login" to="/login"><i class="bi bi-wallet2"></i> Connect Your Wallet</router-link>

        <div class="dropdown float-right" id="logout">
            <button class="btn btn-outline-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i>
                Profile
            </button>
            <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" @click="logout()"><i class="bi bi-box-arrow-right"></i> Logout</a>
            </div>
        </div>

    </nav>
</template>

<script>
import store from '../../store/store'

export default {
    data(){
        return {
            isActive: true
        }
    },

    mounted(){
        //this.$router.push({name: 'home'});
        store.commit('storeInit');
        if(store.state.walletAddr != ""){
            document.getElementById("login").style.display = "none";
            document.getElementById("logout").style.display = "block";
        }
        else{
            document.getElementById("login").style.display = "block";
            document.getElementById("logout").style.display = "none";
        }
    },

    methods: {
        logout() {
            //if(store.state.isMyAlgoConnected) this.$myAlgoWallet.disconnect();
            if(store.state.isPeraConnected) this.$peraWallet.disconnect();
            //if(store.state.isAlgoSignerConnected) window.AlgoSigner.disconnect();

            store.commit('logout');
            this.$router.push({name: 'about'});
            document.getElementById("login").style.display = "block";
            document.getElementById("logout").style.display = "none";
        },

        toggleSidebar(){
            if (this.isActive) {
                document.getElementById("sidebar").style.display = "none"
                this.isActive = false
            }
            else {
                document.getElementById("sidebar").style.display = "flex"
                this.isActive = true
            }
        }
    }
}
</script>

<style scoped>
#sidebar-button:hover{
    background-color: #e7e7e7;
}

#sidebar-button:focus{
   border: 0px;
}
.navbar{
    background-color: #f5f5f5;
}
.form-inline{
    margin-left: 5rem;
}

.form-control{
    background-color: #f7f7f7 !important;
}

#submit-btn{
    margin-left: -3rem;
    z-index: 10;
    background-color: transparent;
}

</style>

<li id="login" class="nav-item"><router-link class="nav-link" to="/login">Login</router-link></li>
<li id="logout" class="nav-item"><a class="nav-link" @click="logout()">Logout</a></li>