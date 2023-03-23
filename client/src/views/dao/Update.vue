<template>
    <div class="container-fluid">
        <div class="row">

            <div class="col p-0 card shadow-lg">
                <div class="card-body d-flex flex-row">

                    <div class="col-md-6 mt-3">
                        <img src="../../assets/images/dao_update/update.png" class="img-fluid">
                    </div>

                    <div v-if="!isSubmitted" class="col-md-6 align-self-center">

                        <form @submit.prevent="handleSubmit" v-if="!isSubmitted && field != 'isProposalPublic'">
                            <h5 class="card-title text-primary"><b><i class="bi bi-cloud-upload"></i> Update Dao
                                    {{ field }}</b></h5>

                            <label class="mt-4">Edit {{ field }}</label> <br>

                            <input class="form-control" type="text" v-model="this.dao[this.field]" required>

                            <button class="btn btn-outline-success alling-self-center mt-4"><i class="bi bi-upload"></i>
                                Submit</button>

                        </form>

                        <form @submit.prevent="handleSubmit" v-else>
                            <h5 class="card-title text-primary"><b><i class="bi bi-cloud-upload"></i> Update Proposals
                                    Visibility</b></h5>

                            <div class="custom-control custom-switch mt-4 mb-4">
                                <input type="checkbox" class="custom-control-input" id="customSwitch1"
                                    v-model="this.dao[this.field]">
                                <label class="custom-control-label" for="customSwitch1">Public proposals</label>
                            </div>

                            <button class="btn btn-outline-success alling-self-center mt-4"><i class="bi bi-upload"></i>
                                Submit</button>

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
    </div>

</template>

<script>
import Messages from "../../components/base/Messages.vue"
import store from '../../store/store';
const algosdk = require('algosdk');

const axios = require('axios');
const defUrl = 'http://localhost:8081';

export default {
    data() {
        return {
            dao: {},
            isSubmitted: false,
            message: ""
        }
    },

    props: ["field", "id"],

    components: { Messages },

    mounted() {
        axios.get(defUrl + '/daos/get/' + this.id)
            .then((response) => {
                this.dao = response.data;
            })
            .catch((error) => {
                this.$router.push({ name: 'notFound' }); //da sistemare!
            })

    },

    methods: {
        handleSubmit() {
            this.isSubmitted = true;
            axios.post(defUrl + '/daos/update/start', { dao: this.dao, field: this.field })
                .then((response) => {
                    this.signTxn(response.data.txn)
                        .then((result) => {
                            axios.post(defUrl + '/daos/update/end', { txn: result.blob.join(","), dao: response.data.dao })
                                .then((res) => {
                                    this.message = res.data;
                                })
                                .catch((err) => { this.message = err.response.data });
                        });
                })
                .catch((err) => { this.message = err.response.data })
        },

        async signTxn(encodedTxn) {
            const txn = Uint8Array.from(encodedTxn.split(","));
            if (store.state.isMyAlgoConnected) return await this.$myAlgoWallet.signTransaction(txn);
            else if (store.state.isPeraConnected) this.$peraWallet.signTransaction(txn);
            else if (store.state.isAlgoSignerConnected) window.AlgoSigner.signTxn(txn);
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