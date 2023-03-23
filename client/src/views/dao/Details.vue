<template>
    <div class="container-fluid">

        <div class="row ">
            <div class="mt-5 col-md d-flex flex-column justify-content-left" id="title-bar">

                <h1 class="mt-5 ml-4 row title align-self-start" id="title-icon">
                    <i class="bi bi-info-circle mr-2"></i>
                    Dao Details
                </h1>

                <h5 class="ml-5 pl-5 row align-self-start" id="snd-title">
                    Secondary title here!
                </h5>

            </div>
        </div>

        <Wallet :walletAddr="walletAddr"></Wallet>

        <div class="row p-3">

            <div class="card m-3 main-card shadow-sm">
                <div class="card-header d-flex justify-content-center">
                    <h5 class="b text-primary">
                        <i class="bi bi-gear"></i>
                        Dao Settings
                    </h5>
                </div>
                    
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img class="img-fluid" src="../../assets/images/dao_details/Association.png">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h4 class="card-title text-primary b mb-4">
                                <i class="bi bi-briefcase mr-1"></i>
                                <span class="">{{ dao.name }}</span>
                                <router-link :to="{ name: 'daoUpdate', params: { id: this.id, field: 'name' } }"><i
                                        class="bi bi-pen ml-3"></i></router-link>
                            </h4>
                            <p class="card-text">
                                <span class="text-primary"><i class="bi bi-person-square"></i> Owner: </span>
                                <span>{{ dao.owner }}</span>
                                <router-link :to="{ name: 'daoUpdate', params: { id: this.id, field: 'owner' } }"><i
                                        class="bi bi-pen ml-3"></i></router-link>
                            </p>
                            <p class="card-text"> <span class="text-primary"><i class="bi bi-app-indicator"></i>
                                    AppId:</span> <span>{{ dao.appId }}</span></p>
                            <p class="card-text"> <span class="text-primary"><i class="bi bi-link-45deg"></i>
                                    Url:</span> <a :href="dao.url" class="card-text">{{ dao.url }}</a></p>
                            <p class="card-text"> <span class="text-primary"><i class="bi bi-hash"></i> Url Hash:
                                </span>{{ dao.urlHash }}</p>
                            <p class="card-text"> <span class="text-primary"><i class="bi bi-pin-angle"></i> ASA Token
                                    Id:</span> <span>{{ dao.tokenAddr }}</span></p>
                            <p class="card-text">
                            <div v-if="dao.isAssociation" class="badge badge-success mr-4 mb-1">Association</div>
                            <div v-else class="badge badge-success mr-4 mb-1">SRL</div>
                            <span v-if="dao.isProposalPublic" class="text-success">
                                <i class="bi bi-check2-square">Public proposals</i>
                                <router-link
                                    :to="{ name: 'daoUpdate', params: { id: this.id, field: 'isProposalPublic' } }"><i
                                        class="bi bi-pen ml-3 text-success"></i></router-link>
                            </span>
                            <span v-else class="text-danger">
                                <i class="bi bi-x-square"></i>Private proposals
                                <router-link
                                    :to="{ name: 'daoUpdate', params: { id: this.id, field: 'isProposalPublic' } }"><i
                                        class="bi bi-pen ml-3 text-danger"></i></router-link>
                            </span>
                            </p>

                            <p class="card-text"><small class="text-muted align-self-end">Created: <span>{{
                                    String(dao.createdAt).slice(0, 10)
                            }}</span></small></p>

                            <div class="btn-group btn-group-sm">
                                <a class="btn btn-outline-info"
                                    :href="`https://testnet.algoexplorer.io/application/${dao.appId}`" target="_blank">
                                    <i class="bi bi-box-arrow-right"></i>
                                    View in explorer
                                </a>
                                <button v-if="walletAddr == dao.owner"  class="btn btn-outline-danger" data-toggle="modal" data-target="#confirmationModal">
                                    <i class="bi bi-trash"></i>
                                    Delete
                                </button>
                                <router-link v-if="dao.isProposalPublic || (walletAddr == dao.owner && !dao.isProposalPublic)" class="btn btn-outline-success"
                                    :to="{ name: 'proposalCreate', params: { daoAppId: this.daoAppId } }">
                                    <i class="bi bi-megaphone mr-1"></i>
                                    Create Proposal
                                </router-link>
                            </div>

                            <!-- Confirmation Modal -->
                            <div class="modal fade" id="confirmationModal" tabindex="-1"
                                aria-labelledby="confirmationModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="confirmationModalLabel">
                                                Deleting Dao 
                                                <span class="text-danger ml-1">you Shure?</span>
                                            </h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        
                                        <div class="modal-body">
                                            <div class="d-flex justify-content-center mb-3">
                                                <img class="img-fluid"  id="modal-img" src="../../assets/images/dao_details/delete.png">
                                            </div>
                                            
                                            <div class="d-flex justify-content-center">
                                                <button type="button" class="btn btn-outline-secondary mr-3"
                                                data-dismiss="modal">Back</button>
                                            <button type="button" class="btn btn-outline-danger" data-dismiss="modal"
                                                @click="remove">Confirm</button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="row">

            <div class="col-md m-3">
                <div class="card shadow activities-card">
                    <div class="card-header d-flex justify-content-center">
                        <h5 class="b text-primary">
                            <i class="bi bi-inbox mr-2"></i>
                            Proposals
                        </h5>
                    </div>
                    <div class="card-body d-flex justify-content-center">

                        <div class="d-flex justify-content-center" v-if="proposals.length == 0">
                            <h2 class="mt-3 mb-4">
                                <i class="bi bi-trash3 m3"></i>
                                Nothing to display!
                            </h2>
                        </div>

                        <div v-for="proposal in proposals" :key="proposals.appId" class="">
                            <router-link class="link-box" :to="{ name: 'proposalDetails', params: { id: proposal._id } }">
                                <div class="card card-link bg-light m-2">
                                    <div v-if="currDate > new Date(proposal.endDate)"
                                        class="card-header d-flex justify-content-center"><i
                                            class="bi bi-hourglass-bottom"></i> Expired</div>
                                    <div v-else class="card-header d-flex justify-content-center"><i
                                            class="bi bi-hourglass-split"></i> Avaiable</div>
                                    <div class="card-body">
                                        <p class="card-text"><i class="bi bi-megaphone mr-1"></i> {{
                                                proposal.description
                                        }}</p>
                                        <p class="card-text"><i class="bi bi-calendar2-check"></i> Start Date: {{
                                                proposal.startDate.slice(0, 10)
                                        }}</p>
                                        <p class="card-text"><i class="bi bi-calendar-x"></i> End Date: {{
                                                proposal.endDate.slice(0, 10)
                                        }}</p>
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
                        <img src="../../assets/images/dao_details/bottom.png" class="img-fluid details-img">
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
    props: ["id"],

    components: { Wallet },

    computed: {
        walletAddr() {
            return store.state.walletAddr;
        }
    },

    data() {
        return {
            dao: {},
            proposals: [],
            daoAppId: 0,
            currDate: {},
        }
    },

    mounted() {
        this.currDate = new Date();
        axios.get(defUrl + '/daos/get/' + this.id)
            .then((response) => {
                this.dao = response.data;
                this.daoAppId = this.dao.appId;

                axios.get(defUrl + '/proposals/all/dao/' + this.daoAppId)
                    .then((response) => {
                        this.proposals = response.data;
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
            .catch((error) => {
                this.$router.push({ name: 'notFound' }); //da sistemare!
            })

    },

    methods: {
        remove() {
            axios.delete(defUrl + '/daos/' + this.id, { data: { walletAddr: store.state.walletAddr } })
                .then((response) => {
                    this.$router.push({ name: 'home' });
                })
                .catch((error) => {
                    this.$router.push({ name: 'notFound' }); //da sistemare!
                })
        }
    }
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

.main-card {
    border-bottom: 0.25rem solid #007bff !important;
    border: 1px solid #e3e6f0;
    border-radius: 0.35rem;
}

.card-link:hover {
    background-color: #007bff !important;
    color: white;
}

.link-box {
    color: black;
}

.link-box:hover {
    text-decoration: none;
}


.activities-card {
    border-bottom: 0.25rem solid #007bff !important;
    border: 1px solid #e3e6f0;
    border-radius: 0.35rem;
}

#modal-img{
    max-width: 20rem;
}
</style>