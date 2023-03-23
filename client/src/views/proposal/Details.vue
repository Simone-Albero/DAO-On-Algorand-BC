<template>
    <div class="container-fluid">

        <div class="row ">
            <div class="mt-5 col-md d-flex flex-column justify-content-left" id="title-bar">

                <h1 class="mt-5 ml-4 row title align-self-start" id="title-icon">
                    <i class="bi bi-info-circle mr-2"></i>
                    Proposal Details
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
                        Proposal Settings
                    </h5>
                </div>

                <div class="row no-gutters">
                    <div class="col-md-4 mt-5 pt-4">
                        <img class="img-fluid" src="../../assets/images/proposal_details/proposal.png">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            
                            <h4 class="card-title text-primary b mb-4">
                                <span class=""><i class="bi bi-megaphone"></i> {{ proposal.description }}</span>
                                <router-link class="btn btn-outline-primary btn-sm ml-2" :to="{ name: 'daoDetails', params: { id: daoId } }">
                                    <i class="bi bi-box-arrow-right"></i> Linked Dao
                                </router-link>
                            </h4>
                            <p class="card-text"> <span class="text-primary"><i class="bi bi-person-square"></i>
                                    Creator:</span> {{ proposal.creator }}</p>
                            <p class="card-text"> <span class="text-primary"><i class="bi bi-link-45deg"></i>
                                    Url:</span> <a :href="proposal.url" class="card-text">{{ proposal.url }}</a></p>
                            <p class="card-text"> <span class="text-primary"><i class="bi bi-hash"></i> Url Hash:</span>
                                {{ proposal.urlHash }}</p>
                            <p class="card-title"><span class="text-primary"><i class="bi bi-app-indicator"></i>
                                    AppId:</span> {{ proposal.appId }}</p>
                            <p class="card-title">
                                <span class="text-primary"><i class="bi bi-briefcase mr-1"></i> Dao AppId:</span>
                                {{ proposal.daoAppId }}
                            </p>
                            <p class="card-title">
                                <span class="text-primary"><i class="bi bi-pin-angle"></i> ASA Token Id:</span>
                                {{ assetId }}
                                <div v-if="hasAsset" class="badge badge-success ml-2">ASA Token Owner</div>
                                <div v-else class="badge badge-danger ml-2">Missing ASA Token</div>
                            </p>
                            <p class="card-text">
                                <span class="text-primary"><i class="bi bi-calendar2-check"></i> Start Date:</span>
                                {{ String(proposal.startDate).slice(0, 10) }}
                                <span class="text-primary ml-3"><i class="bi bi-calendar-x"></i> End Date:</span>
                                {{ String(proposal.endDate).slice(0, 10) }}
                            <div v-if="currDate > new Date(proposal.endDate)" class="badge badge-danger ml-2">Expired</div>
                            <div v-if="currDate < new Date(proposal.startDate)" class="badge badge-warning ml-2">Not Yet Avaiable</div>
                            <div v-if="currDate < new Date(proposal.endDate) && currDate > new Date(proposal.startDate)" class="badge badge-success ml-2">Avaiable</div>
                            </p>

                            <p class="card-text">
                                <span class="text-success">Yes Votes:</span> {{ proposal.yesVotes }}
                                <span class="text-danger ml-4">No Votes:</span> {{ proposal.noVotes }}
                            </p>

                            <div v-if="(proposal.yesVotes + proposal.noVotes != 0)" class="progress mr-4 mb-5">
                                <div class="progress-bar progress-bar-striped bg-success" role="progressbar"
                                    :style="{ width: yesRate + '%' }" aria-valuenow="100" aria-valuemin="0"
                                    aria-valuemax="100"></div>
                                <div class="progress-bar progress-bar-striped bg-danger" role="progressbar"
                                    :style="{ width: 100 - yesRate + '%' }" aria-valuenow="100" aria-valuemin="0"
                                    aria-valuemax="100"></div>
                            </div>

                            <div class="btn-group btn-group-sm">
                                <a class="btn btn-outline-info"
                                    :href="`https://testnet.algoexplorer.io/application/${proposal.appId}`"
                                    target="_blank">
                                    <i class="bi bi-box-arrow-right"></i>
                                    View in explorer
                                </a>
                                <button v-if="(walletAddr == proposal.creator)" class="btn btn-outline-danger" data-toggle="modal"
                                    data-target="#confirmationModal"><i class="bi bi-trash"></i>Delete</button>
                                <router-link v-if="(currDate < new Date(proposal.endDate) && currDate > new Date(proposal.startDate) && hasAsset)"
                                    class="btn btn-outline-success" :to="{ name: 'proposalVote', params: { id: this.id } }">
                                    <i class="bi bi-clipboard-pulse mr-1"></i>
                                    Vote
                                </router-link>
                            </div>                            

                            <!-- Confirmation Modal -->
                            <div class="modal fade" id="confirmationModal" tabindex="-1"
                                aria-labelledby="confirmationModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="confirmationModalLabel">
                                                Deleting Proposal 
                                                <span class="text-danger ml-1">you Shure?</span>
                                            </h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        
                                        <div class="modal-body">
                                            <div class="d-flex justify-content-center mb-3">
                                                <img class="img-fluid"  id="modal-img" src="../../assets/images/proposal_details/delete.png">
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

        <div class="row m-3">

            <div class="card shadow-sm mb-3 details-box">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="../../assets/images/proposal_details/bottom.png" class="img-fluid details-img">
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

    data() {
        return {
            proposal: {},
            currDate: {},
            yesRate: 0,
            daoId: 0,
            assetId: 0,
            hasAsset: false,
        }
    },

    computed: {
        walletAddr() {
            return store.state.walletAddr;
        }
    },

    mounted() {
        this.currDate = new Date();
        axios.get(defUrl + '/proposals/' + this.id)
            .then((response) => {
                this.proposal = response.data;
                this.yesRate = (this.proposal.yesVotes / (this.proposal.yesVotes + this.proposal.noVotes)) * 100;

                axios.get(defUrl + '/daos/appId/' + this.proposal.daoAppId)
                    .then((response) => { 
                        this.daoId = response.data[0]._id;
                        this.assetId = response.data[0].tokenAddr;

                        axios.get(defUrl + '/user/asset/check/' + this.walletAddr + '/' + response.data[0].tokenAddr)
                            .then((response) => { this.hasAsset = response.data});
                    })
            })
            .catch((error) => {
                this.$router.push({ name: 'notFound' });
            })


    },

    methods: {
        remove() {
            axios.delete(defUrl + '/proposals/' + this.id, { data: { walletAddr: store.state.walletAddr } })
                .then((response) => {
                    this.$router.push({ name: 'home' });
                })
                .catch((error) => {
                    this.$router.push({ name: 'notFound' });
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

#modal-img{
    max-width: 20rem;
}
</style>