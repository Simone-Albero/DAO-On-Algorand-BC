<template>

  <div class="jumbotron bg-white">
    <div v-if="message.slice(0, 5) != 'Error'">
      <h1 class="display-4 text-primary"><i class="bi bi-cloud-plus"></i> Done</h1>
      <p class="text-primary">Your transaction has been completed successfully!</p>
      <hr class="my-4">
      <p class="lead"><i class="bi bi-activity"></i> Executed Transaction:</p>
      <p class="">{{ message }}</p>
      <div class="btn-group mt-4">
        <a class="btn btn-outline-info" :href="`https://testnet.algoexplorer.io/tx/${message}`" target="_blank">
          <i class="bi bi-box-arrow-right"></i>
          View in explorer
        </a>
        <button class="btn btn-outline-danger" @click="back">
          Back
        </button>
      </div>

    </div>
    <div v-else>
      <h1 class="display-4 text-danger"><i class="bi bi-cloud-plus"></i> Done</h1>
      <p class="text-danger">Your transaction has not been completed successfully</p>
      <hr class="my-4">
      <p class="lead"><i class="bi bi-activity"></i> Found Error:</p>
      <p class="">{{ message }}</p>
    </div>

  </div>

</template>

<script>
export default {
  props: ["message"],

  methods: {
    back(){
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.jumbotron {
  margin-top: 3rem;
}
</style>