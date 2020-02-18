<template>
  <v-content>
    <Header />
    <v-container>
      <v-snackbar
        :value="snackbar.value"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        :right="snackbar.x === 'right'"
        :top="snackbar.y === 'top'"
        @input="snackbarClose"
      >
        <div v-if="typeof snackbar.text === 'object'">
          <p v-for="(item, key, index) in snackbar.text" :key="index" class="font-weight-medium text-capitalize">
            {{ `${key} : ${item}` }}
          </p>
        </div>
        <span v-else>{{ snackbar.text }}</span>
        <v-btn dark text>
          <v-icon @click="snackbarClose()">
            mdi-close
          </v-icon>
        </v-btn>
      </v-snackbar>
      <confirm-dialog ref="confirmDialog" />
      <router-view />
    </v-container>
  </v-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Header from '@/views/dashboard/partials/Header.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

export default {
  name: 'Layout',
  components: {
    Header,
    ConfirmDialog
  },
  computed: {
    ...mapState(['snackbar'])
  },
  mounted() {
    this.$root.$confirmDialog = this.$refs.confirmDialog
  },
  methods: {
    ...mapMutations(['snackbarClose'])
  }
}
</script>

<style scoped></style>
