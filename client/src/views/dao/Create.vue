<template>
    <div class="container-fluid">

        <div class="row">

            <div class="col p-0 card shadow-lg">
                <div class="card-body d-flex flex-row">

                    <div class="col-md-6 mt-5">
                        <img src="../../assets/images/dao_create/form_img.png" class="img-fluid">
                    </div>

                    <div v-if="!isSubmitted" class="col-md-6 align-self-center mt-1">
                        <h5 class="card-title text-primary"><b><i class="bi bi-cloud-upload"></i> Create Your Dao</b>
                        </h5>

                        <form @submit.prevent="handleSubmit">
                            <div class="form-group mt-3">
                                <label><i class="bi bi-person-vcard"></i> Name</label>
                                <input class="form-control" type="text" v-model="name" required>

                                <label class="mt-3"><i class="bi bi-link-45deg"></i> Url</label>
                                <input class="form-control" type="text" v-model="url" required>

                                <label class="mt-3"><i class="bi bi-link-45deg"></i> Url Hash</label>
                                <input class="form-control" type="text" v-model="urlHash" required>

                                <div class="custom-control custom-switch mt-4 mb-4">
                                    <input type="checkbox" class="custom-control-input" id="customSwitch1"
                                        v-model="isProposalPublic">
                                    <label class="custom-control-label" for="customSwitch1"><i
                                            class="bi bi-diagram-3"></i> Public proposals</label>
                                </div>

                                <label><i class="bi bi-pin-angle"></i> ASA Token Id</label>
                                <input class="form-control" type="number" v-model="tokenAddr" required>

                                <label class="mt-4"><i class="bi bi-briefcase mr-1"></i> Type</label>
                                <select class="custom-select mb-4">
                                    <option selected>Select Type</option>
                                    <option :value='false'>SRL</option>
                                    <option :value='true'>Association</option>
                                </select>

                            </div>

                            <div class="d-flex justify-content-center">
                                <button class="btn btn-outline-success alling-self-center"><i class="bi bi-upload"></i>
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

    </div>

</template>

<script>
import Messages from "../../components/base/Messages.vue"
import store from '../../store/store';

const axios = require('axios');
const defUrl = 'http://localhost:8081';

export default {
    data() {
        return {
            name: "",
            url: "",
            urlHash: "",
            isProposalPublic: false,
            tokenAddr: 0,
            isAssociation: false,
            isSubmitted: false,
            message: ""
        }
    },

    components: { Messages },

    methods: {
        handleSubmit() {
            this.isSubmitted = true;

            axios.post(defUrl + '/daos/make/start', {
                owner: store.state.walletAddr, name: this.name, url: this.url,
                urlHash: this.urlHash, isProposalPublic: this.isProposalPublic, tokenAddr: this.tokenAddr, isAssociation: this.isAssociation
            })
                .then((response) => {
                    this.signTxn(response.data.txn)
                        .then((result) => {
                            axios.post(defUrl + '/daos/make/end', { txn: result.blob.join(","), dao: response.data.dao })
                                .then((res) => {
                                    this.message = res.data;
                                })
                                .catch((err) => { this.message = err.response.data });
                        });
                })
                .catch((err) => { this.message = err.response.data });
        },

        async signTxn(encodedTxn) {
            const txn = Uint8Array.from(encodedTxn.split(","));
            if (store.state.isMyAlgoConnected) return await this.$myAlgoWallet.signTransaction(txn);
            else if (store.state.isPeraConnected) return await this.$peraWallet.signTransaction(txn);
            else if (store.state.isAlgoSignerConnected) return await window.AlgoSigner.signTxn(txn);
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