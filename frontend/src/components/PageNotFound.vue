<template>
  <v-container>
    <section class="page-404">
      <div class="text-center grey--text text--darken-3">
        <div :style="{ height: imageHeight }" class="image-404">
          <h1 class="text-center ">
            404
          </h1>
        </div>
        <aside class="content">
          <h3>
            Look like you're lost
          </h3>
          <p>The page you are looking for not available!</p>
          <v-btn link color="blue darken-1" text to="/">
            Go to Home
          </v-btn>
        </aside>
      </div>
    </section>
  </v-container>
</template>

<script>
export default {
  name: 'PageNotFound',
  computed: {
    imageHeight() {
      return `${this.$vuetify.breakpoint.width / 1.7}px`
    }
  }
}
</script>

<style scoped lang="scss">
.page-404 {
  background: #fff;
}
.image-404 {
  max-height: 400px;
  background: url(../assets/404.gif) center center no-repeat;
  background-size: contain;
}
.image-404 h1 {
  font-size: 60px;
}
@media (max-width: 600px) {
  .image-404 h1 {
    font-size: 44px;
  }
}
</style>
