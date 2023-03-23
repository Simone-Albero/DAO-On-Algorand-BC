<template>
	<div class="container-fluid">

		<div class="row ">
			<div class="mt-5 col-md d-flex flex-column justify-content-left" id="title-bar">

				<h1 class="mt-5 ml-4 row title align-self-start" id="title-icon">
					<i class="bi bi-chat-right-quote pr-3"></i>
					About Us
				</h1>

				<h5 class="ml-5 pl-5 row align-self-start" id="snd-title">
					Secondary title here!
				</h5>

			</div>
		</div>

		<div class="row m-1 info-box">

			<div class="col-md shadow-sm card m-2 justify-content-end">

					<div class="d-flex justify-content-center">
						<img src="../assets/images/about/info1.png" class="card-img-top info-img">
					</div>

					<div class="">
						<div class="card-body text-center info-text">
							<h5 class="card-title text-primary">Create your dao</h5>
							<p class="card-text">Thinking about dao? create it yourself.</p>
							<router-link class="btn btn-outline-primary" to="/dao/create"><i class="bi bi-box-arrow-right"></i> View More</router-link>
						</div>
					</div>
			</div>

			<div class="col-md shadow-sm card m-2 justify-content-end">

					<div class="d-flex justify-content-center">
						<img src="../assets/images/about/info2.png" class="card-img-top info-img">
					</div>

					<div class="">
						<div class="card-body text-center info-text">
							<h5 class="card-title text-primary">Express Your idea</h5>
							<p class="card-text">Share your opinion with everyone</p>
							<router-link class="btn btn-outline-primary" to="/proposal"><i class="bi bi-box-arrow-right"></i> View More</router-link>
						</div>
					</div>

			</div>

			<div class="col-md shadow-sm card m-2 justify-content-end">

					<div class="d-flex justify-content-center">
						<img src="../assets/images/about/info3.png" class="card-img-top info-img">
					</div>

					<div class="">
						<div class="card-body text-center info-text">
							<h5 class="card-title text-primary">Cast Your Vote</h5>
							<p class="card-text">Don't just sit there! start voting now</p>
							<router-link class="btn btn-outline-primary" to="/proposal"><i class="bi bi-box-arrow-right"></i> View More</router-link>
						</div>
					</div>

				</div>

		</div>

		<div class="row m-3">

			<div class="card shadow-sm mb-3 details-box">
				<div class="row no-gutters">
					<div class="col-md-4">
						<img src="../assets/images/about/details1.png" class="img-fluid details-img">
					</div>
					<div class="col-md">
						<div class="card-body">
							<div class="col-md">
								<h2 class="reference-heading pl-3">
									<span class="text-muted">Wondering How To Make </span>
									<span class="">Your DAO Rock?</span>
								</h2>
								<p class="lead pl-3">Revolutionize Your DAO With Us.</p>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>

		<div class="row m-3">

			<div class="card shadow-sm mb-3 details-box">
				<div class="row no-gutters">
					<div class="col-md">
						<div class="card-body">
							<div class="col-md">
								<h2 class="reference-heading">
									<span class="text-muted">Have You Heard? </span>DAO Is
									<span>Your Best Bet To Grow</span> 
								</h2>
								<p class="lead">Fall In Love With DAO, Is Essential For Your Success.</p>
							</div>
						</div>
					</div>

					<div class="col-md-4">
						<img src="../assets/images/about/details2.png" class="img-fluid details-img">
					</div>

				</div>
			</div>

		</div>

	</div>

</template>

<script>
import store from '../store/store';

export default {
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

.info-img {
	padding-top: 1rem;
	max-width: 13vw;
}

.info-box {
	margin-top: -10vh !important;
}

.info-text{
	min-width: 10vw;
}

.details-box {
	min-width: 100%;
}

.details-img {
	max-width: 22vw;
}

.reference-heading {
	font-weight: 300;
	line-height: 1;
	letter-spacing: -.05rem;
	font-family: 'DM Serif Display', serif;
}

</style>
