<template>
    <div class="row">

        <div class="col p-0 card shadow-lg">
            <div class="card-body d-flex flex-row">

                <div class="col-md-6">
                    <img src="../../assets/images/proposal_create/proposal_create.png" class="img-fluid">
                </div>

                <div v-if="!isSubmitted" class="col-md-6 align-self-center">
                    <h5 class="card-title text-primary"><b><i class="bi bi-cloud-upload"></i> Create Your Proposal</b>
                    </h5>

                    <form @submit.prevent="handleSubmit" v-if="!isSubmitted">
                        <label class="mt-2"><i class="bi bi-megaphone mr-1"></i>Description</label>
                        <input class="form-control" type="text" v-model="description" required>

                        <label class="mt-3"><i class="bi bi-link-45deg"></i> Url</label>
                        <input class="form-control" type="text" v-model="url" required>

                        <label class="mt-3"><i class="bi bi-link-45deg"></i> UrlHash</label>
                        <input class="form-control" type="text" v-model="urlHash" required>

                        <div class="form-row mt-4">
                            <div class="col">
                                <label class=""><i class="bi bi-calendar2-check"></i> Start Date</label>
                                <input class="form-control" type="datetime-local" v-model="startDate" required>
                            </div>
                            <div class="col">
                                <label class=""><i class="bi bi-calendar-x"></i> End Date</label>
                                <input class="form-control" type="datetime-local" v-model="endDate" required>
                            </div>
                        </div>

                        <div class="d-flex justify-content-center">
                            <button class="btn btn-outline-success alling-self-center mt-4"><i class="bi bi-upload"></i>
                                Submit</button>
                        </div>

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
    props: ["daoAppId"],

    data() {
        return {
            description: "",
            url: "",
            urlHash: "",
            startDate: "",
            endDate: "",
            isSubmitted: false,
            message: ""
        }
    },

    components: { Messages },

    methods: {
        handleSubmit() {
            this.isSubmitted = true;
            axios.post(defUrl + '/proposals/make/start', {
                daoAppId: parseInt(this.daoAppId), creator: store.state.walletAddr, description: this.description, url: this.url,
                urlHash: this.urlHash, startDate: this.startDate, endDate: this.endDate
            })
                .then((response) => {
                    this.signTxns([response.data.txn1, response.data.txn2])
                        .then((txns) => {
                            axios.post(defUrl + '/proposals/make/end', { txn1: txns[0].blob.join(","), txn2: txns[1].blob.join(","), proposal: response.data.proposal })
                                .then((res) => {
                                    this.message = res.data;
                                })
                                .catch((err) => { this.message = err.response.data });
                        });
                })
                .catch((err) => { this.message = err.response.data });
        },

        async signTxns(encodedTxns) {
            var txns = [];
            encodedTxns.forEach(function (encodedTxn) { txns.push(Uint8Array.from(encodedTxn.split(","))) });

            if (store.state.isMyAlgoConnected) return await this.$myAlgoWallet.signTransaction(txns);
            else if (store.state.isPeraConnected) return await this.$peraWallet.signTransaction(txns);
            else if (store.state.isAlgoSignerConnected) return await window.AlgoSigner.signTxn(txns);
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