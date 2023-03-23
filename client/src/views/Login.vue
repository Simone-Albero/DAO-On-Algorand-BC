<template>
    <div class="container-fluid">
        <div class="row">
            
            <div class="col p-0 card shadow-lg">
                <div class="card-body d-flex flex-row">

                    <div class="col-md-6">
						<img src="../assets/images/login/form_img.png" class="img-fluid info-img">
					</div>

                    <div class="col-md-6 align-self-center">
                        <h5 class="card-title text-primary"><b>Coonect Wallet</b></h5>

                        <div class="">
                            <button @click="connectToMyAlgo" type="button" class="btn btn-outline-primary btn-lg btn-block">MyAlgo Connect<i class="bi bi-arrow-right pl-2"></i></button>
                            <button @click="connectToPera" type="button" class="btn btn-outline-primary btn-lg btn-block">Pera Connect<i class="bi bi-arrow-right pl-2"></i></button>
                            <button @click="connectToAlgoSigner" type="button" class="btn btn-outline-primary btn-lg btn-block">AlgoSigner Connect<i class="bi bi-arrow-right pl-2"></i></button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    
    </div>
</template>

<script>
import store from '../store/store';

export default {
    data(){
        return {
            isAlgoSignerAvaiable: true
        }
    },

    methods: {
        async connectToMyAlgo() {
            try {
                const accounts = await this.$myAlgoWallet.connect();
                const addresses = accounts.map(account => account.address);
                store.commit('setWalletAddr', addresses[0]);
                store.commit('toggleMyAlgoStatus');
                this.$router.push({name: 'home'});
                document.getElementById("login").style.display = "none";
                document.getElementById("logout").style.display = "block";
                
            } catch (err) {
                console.error(err);
            }
        },

        connectToPera(){
            this.$peraWallet.connect()
            .then((newAccounts) => {
                // Setup the disconnect event listener
                peraWallet.connector?.on("disconnect",() => {
                    this.$peraWallet.disconnect();
                    Store.commit('logout');
                    this.$router.push({name: 'home'});
                });
                store.commit('setWalletAddr', newAccounts[0]);
                store.commit('togglePeraStatus');
                this.$router.push({name: 'home'});
                document.getElementById("login").style.display = "none";
                document.getElementById("logout").style.display = "block";
            })
            .catch((error) => {
                if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
                    console.log(error);
                }
            });
        },

        connectToAlgoSigner(){
            if (typeof AlgoSigner !== 'undefined') {
                this.isAlgoSignerAvaiable = true;
                window.AlgoSigner.connect()
                .then(() =>
                    window.AlgoSigner.accounts({
                        ledger: "TestNet",
                    })
                )
                .then((accountData) => {
                    store.commit('setWalletAddr', accountData[0].address);
                    store.commit('toggleAlgoSignerStatus');
                    this.$router.push({name: 'home'});
                    document.getElementById("login").style.display = "none";
                    document.getElementById("logout").style.display = "block";
                })
                .catch((err) => {
                    console.log(err);
                })
            }
            else{
                this.isAlgoSignerAvaiable = false;
            }
        }
    }
}
</script>

<style scoped>
.row{
    background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(37,145,251,0.98) 0.1%, rgba(0,7,128,1) 99.8% );
    background-size: cover;
    background-repeat: no-repeat;
    min-height: 100vh;
}

.card{
    max-width: 45vw;
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
}

</style>
