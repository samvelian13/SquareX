<template>
  <div class="confirm-dialog">
    <v-dialog :value="isActive" max-width="400" @keydown.esc="cancel" @keydown.enter="agree" @click:outside="cancel">
      <v-card>
        <v-card-title class="headline grey--text text--darken-3">
          {{ text }}
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey darken-3" text @click="cancel">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="agree">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  data: () => ({
    isActive: false,
    resolve: null,
    reject: null,
    text: null
  }),
  methods: {
    open(text) {
      this.isActive = true
      this.text = text
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree() {
      this.resolve(true)
      this.isActive = false
    },
    cancel() {
      this.resolve(false)
      this.isActive = false
    }
  }
}
</script>
