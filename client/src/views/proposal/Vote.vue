<template>
    <div class="row">

        <div class="col p-0 card shadow-lg">
            <div class="card-body d-flex flex-row">

                <div class="col-md-6">
                    <img src="../../assets/images/dao_create/form_img.png" class="img-fluid">
                </div>

                <div v-if="!isSubmitted" class="col-md-6 align-self-center">
                    <h4 class="card-title text-primary mb-4"><b>Cast Your Vote</b></h4>

                    <form @submit.prevent="handleSubmit" v-if="!isSubmitted">
                        <h5 class="mb-2">{{ proposal.description }}</h5>

                        <div class="custom-control custom-radio ml-3 mt-2">
                            <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input"
                                v-model="value" value="yes">
                            <label class="custom-control-label" for="customRadio1">Yes</label>
                        </div>
                        <div class="custom-control custom-radio ml-3">
                            <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input"
                                v-model="value" value="no">
                            <label class="custom-control-label" for="customRadio2">No</label>
                        </div>

                        <button class="btn btn-success alling-self-center mt-4">Submit</button>
                    </form>

                </div>

                <div v-if="message == '' && isSubmitted" class="col-md-6 d-flex align-items-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <h2 class="text-primary ml-3 mt-2">Sending Transaction</h2>
                </div>

                <div v-if="message != '' && isSubmitted" class="col-md-6">
                    <Messages :message="message"></Messages>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
import Messages from "../../components/base/Messages.vue"
import store from '../../store/store';

const axios = require('axios');
const defUrl = 'http://localhost:8081';

export default {
    props: ["id"],

    data() {
        return {
            proposal: {},
            value: "",
            token: 0,
            isSubmitted: false,
            message: ""
        }
    },

    mounted() {
        axios.get(defUrl + '/proposals/' + this.id)
            .then((response) => {
                this.proposal = response.data;
                axios.get(defUrl + '/daos/appId/' + this.proposal.daoAppId)
                    .then((response) => {
                        this.token = response.data[0].tokenAddr;
                    })
            })
            .catch((error) => {
                this.$router.push({ name: 'notFound' });
            })
    },

    components: { Messages },

    methods: {
        handleSubmit() {
            this.isSubmitted = true;
            axios.post(defUrl + '/proposals/optIn/start', { appId: this.proposal.appId, token: this.token, sender: store.state.walletAddr })
                .then((txn1) => {
                    axios.post(defUrl + '/proposals/call/start', { appId: this.proposal.appId, value: this.value, sender: store.state.walletAddr, field: "vote" })
                        .then((txn2) => {
                            this.signTxns([txn1.data.txn, txn2.data.txn])
                                .then((txns) => {
                                    axios.post(defUrl + '/proposals/optIn/end', { txn: txns[0].blob.join(",") })
                                        .then((res) => {
                                            axios.post(defUrl + '/proposals/call/end', { txn: txns[1].blob.join(","), proposal: this.proposal, value: this.value })
                                                .then((res) => {
                                                    this.message = res.data;
                                                })
                                                .catch((err) => { this.message = err.response.data });
                                        })
                                        .catch((err) => { this.message = err.response.data });
                                });
                        })
                })
                .catch((err) => { this.message = err.response.data });
        },

        async signTxns(encodedTxns) {
            var txns = [];
            encodedTxns.forEach(function (encodedTxn) { txns.push(Uint8Array.from(encodedTxn.split(","))) });

            if (store.state.isMyAlgoConnected) return await this.$myAlgoWallet.signTransaction(txns);
            else if (store.state.isPeraConnected) return await this.$peraWallet.signTransaction(txns);
            else if (store.state.isAlgoSignerConnected) return await window.AlgoSigner.signTxn(txns);
        },

        getDaoByAppId() {

        }
    }

}
</script>

<style scoped>
.row {
    background-image: radial-gradient(circle farthest-corner at 10% 20%, rgba(37, 145, 251, 0.98) 0.1%, rgba(0, 7, 128, 1) 99.8%);
    background-size: cover;
    background-repeat: no-repeat;
    min-height: 100vh;
}

.card {
    max-width: 70vw;
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>