<template>
		<div class="row mb-4 d-flex justify-content-center">
			<div class="col-md-auto">
				<div class="card flex-row row-md ml-4 mr-4 shadow top-card">
					<div class="col-md-auto mt-3 mb-3 ml-3 card-body">
						<h5 class="card-title text-primary mb-4 mr-5"><i class="bi bi-cloud-arrow-up"></i> Connected Wallet:</h5>
						<p class="card-text card-details mb-4">
							<span class="b text-primary"><i class="bi bi-link-45deg"></i> Address:</span>
							{{ walletAddr }}
						</p>

						<p class="card-text card-details">
							<span class="text-success mr-1"><i class="bi bi-cash-stack"></i> Balance:</span> 
							{{balance}} 
							<img src="../../assets/images/algo-logo.png" class="img-fluid" id="algo-logo">
						</p>

						<a :href="`https://testnet.algoexplorer.io/address/${walletAddr}`" class="btn btn-outline-primary btn-sm mt-2" target="_blank">
							<i class="bi bi-box-arrow-right"></i>
							View in explorer 
						</a>
					</div>
					<div class="col-auto d-flex">
						<div class="align-self-center">
							<i class="bi bi-cash-coin card-icon align-self-center text-primary"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
</template>

<script>
const axios = require('axios');
const defUrl = 'http://localhost:8081';

export default {
    props: ["walletAddr"],

	data() {
		return {
			balance: 0
		}
	},

	mounted(){

		axios.get(defUrl + '/user/balance/' + this.walletAddr)
			.then((response) => {
				this.balance = response.data;
			})
			.catch((error) => {
				console.log(error);
			})
	}
}
</script>

<style scoped>
.top-card {
	margin-top: -5rem;
	border-left: 0.25rem solid #007bff !important;
	border: 1px solid #e3e6f0;
	border-radius: 0.35rem;
}

.card-icon {
	font-size: 7rem;
	font-weight: 900;
}
.card-details {
	font-size: 1.3rem;
}

#algo-logo{
	max-width: 0.8rem;
}

</style>