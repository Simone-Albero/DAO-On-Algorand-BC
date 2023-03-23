<template>
  <div class="container-fluid">

    <div class="row">

      <div class="col p-0 card shadow-lg">
        <div class="card-body d-flex flex-row">

          <div class="col-md-6 mt-5">
            <img src="../assets/images/404.png" class="img-fluid">
          </div>
          
          <div class="card-body mt-5">
            <h2 class="card-title text-primary text-center text-monospace mb-4 mt-4"><b><i class="bi bi-bug-fill"></i> Ops!</b></h2>
            <h5 class="card-text text-wrap text-center">
              <span class="text-primary font-weight-bold">Uh oh,</span> 
              we can't seem to find the page you're looking for. Try going back to the previous page or see our 
              <span class="text-primary font-weight-bold">About Page</span> 
              for more information
            </h5>
            
            <div class="d-flex justify-content-center mt-4">
              <router-link class="btn btn-outline-primary" to="/about">
                <i class="bi bi-box-arrow-right"></i> About Us
              </router-link>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>

</template>


<script>
export default {

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