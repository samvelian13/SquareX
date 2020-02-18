<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" md="5" sm="8">
        <v-card class="elevation-12">
          <v-overlay absolute="absolute" :value="isLoading">
            <v-progress-circular :size="50" color="primary" indeterminate />
          </v-overlay>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Login Form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="validForm">
              <div class="text-center mb-3">
                <span v-if="errorMsg" class="red--text pl-5">
                  {{ errorMsg }}
                </span>
              </div>
              <v-text-field
                v-model="email"
                label="E-mail"
                name="email"
                prepend-icon="mdi-account"
                type="text"
                :rules="rules.email"
                clearable
                autocomplete="email"
                @keyup.enter="onsubmit"
              />
              <v-text-field
                v-model="password"
                :rules="rules.pass"
                prepend-icon="mdi-lock-question"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                name="password"
                label="Password"
                hint="At least 8 characters"
                counter="16"
                autocomplete="current-password"
                @click:append="showPass = !showPass"
                @keyup.enter="onsubmit"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn :disabled="!validForm" color="blue darken-1" text @click="onsubmit">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      validForm: false,
      email: null,
      password: null,
      showPass: false,
      isLoading: false,
      errorMsg: null,
      rules: {
        email: [v => !!v || 'E-mail is required', v => /.+@.+/.test(v) || 'E-mail must be valid'],
        pass: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Password length must be greater than or equal to 8 characters',
          v => (v && v.length <= 16) || 'Password length must be less than or equal to 16 characters'
        ]
      }
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    onsubmit() {
      if (!this.validForm) {
        return
      }
      this.isLoading = true
      const loginData = {
        email: this.email,
        password: this.password
      }
      this.login(loginData)
        .then(() => {
          const nextUrl = this.$route.params.nextUrl || 'drinkMenu'
          this.$router.push({ name: nextUrl })
        })
        .catch(err => {
          this.errorMsg = err.msg
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
