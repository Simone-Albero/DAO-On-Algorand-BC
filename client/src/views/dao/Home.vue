<template>
    <div class="container-fluid">

        <div class="row ">
            <div class="mt-5 col-md d-flex flex-column justify-content-left" id="title-bar">

                <h1 class="mt-5 ml-4 row title align-self-start" id="title-icon">
                    <i class="bi bi-inbox mr-2"></i>
                    Your Daos
                </h1>

                <h5 class="ml-5 pl-5 row align-self-start" id="snd-title">
                    Secondary title here!
                </h5>

            </div>
        </div>

        <Wallet :walletAddr="walletAddr"></Wallet>

        <div class="row">

            <div class="col-md m-3">
                <div class="card shadow activities-card">
                    <div class="card-header d-flex justify-content-center">
                        <h5 class="b text-primary">
                            <i class="bi bi-inbox mr-2"></i>
                            Your Daos
                        </h5>
                    </div>
                    <div class="card-body d-flex justify-content-center">

                        <div class="d-flex justify-content-center" v-if="daos.length == 0">
                            <h2 class="mt-3 mb-4">
                                <i class="bi bi-trash3 m3"></i>
                                Nothing to display!
                            </h2>
                        </div>

                        <div v-for="dao in daos" :key="dao.appId" class="col-md-3">
                            <router-link class="link-box" :to="{name: 'daoDetails', params: {id: dao._id}}">
                                <div class="card card-link bg-light m-2">
                                    <div v-if="daos.isAssociation" class="card-header d-flex justify-content-center">
                                        <i class="bi bi-briefcase mr-1"></i>
                                        Association
                                    </div>
                                    <div v-else class="card-header d-flex justify-content-center"><i class="bi bi-briefcase mr-1"></i>SRL</div>
                                    <div class="card-body">
                                        <p class="card-text"><i class="bi bi-person-vcard"></i> Name: {{ dao.name }}</p>
                                        <p class="card-text"><i class="bi bi-app-indicator"></i> AppId: {{ dao.appId }}</p>
                                        <p class="card-text"><i class="bi bi-calendar-week"></i> Created on: {{ dao.createdAt.slice(0, 10)}}</p>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row m-3">

            <div class="card shadow-sm mb-3 details-box">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="../../assets/images/dao_home/bottom.png" class="img-fluid details-img">
                    </div>
                    <div class="col-md">
                        <div class="card-body">
                            <div class="col-md">
                                <h2 class="reference-heading pl-3">
                                    <span class="text-muted">Lorem ipsum </span>
                                    <span class="">Your DAO Rock?</span>
                                </h2>
                                <p class="lead pl-3">Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                                    Laudantium veritatis nostrum autem amet facere, soluta necessitatibus accusantium
                                    obcaecati nobis ducimus ratione iure quaerat maiores vero tempore nulla placeat
                                    animi dolorem?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>



<script>
import store from '../../store/store';
import Wallet from "../../components/base/Wallet.vue";
const axios = require('axios');
const defUrl = 'http://localhost:8081';

export default {

    components: { Wallet },

    computed: {
        walletAddr() {
            return store.state.walletAddr;
        }
    },

    data() {
        return {
            daos: [],
        }
    },

    mounted() {
        axios.get(defUrl + '/daos/all/' + store.state.walletAddr)
            .then((response) => {
                this.daos = response.data;
            })
            .catch((error) => {
                console.log(error);
            })
    },

}
</script>

<style scoped>
#title-bar {
    height: 32vh;
    background-image: radial-gradient(circle farthest-corner at 10% 20%, rgba(37, 145, 251, 0.98) 0.1%, rgba(0, 7, 128, 1) 99.8%);
}

.title {
    font-size: 3rem;
    font-weight: bold;
    color: white;
}

#snd-title {
    color: rgb(229, 233, 233);
}

.card-link:hover {
    background-color: #007bff !important;
    color: white;
}

.link-box{
    color: black;
}

.link-box:hover{
    text-decoration: none;
}


.activities-card {
    border-bottom: 0.25rem solid #007bff !important;
    border: 1px solid #e3e6f0;
    border-radius: 0.35rem;
}
</style>


