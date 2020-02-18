<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-toolbar dense tile color="grey lighten-4">
      <v-toolbar-title class="mr-3 blue--text">
        Coffee Shop
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="(item, i) in menu" :key="i" :to="item.link" text class="text-capitalize font-weight-regular">
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer />

      <v-menu bottom left absolute close-on-click transition="slide-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn tile large icon class="account-btn" v-on="on">
            <span class="user-name blue--text hidden-xs-only">
              {{ userName }}
            </span>
            <v-icon color="blue">
              mdi-account
            </v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item link @click="onLogout">
            <v-list-item-icon>
              <v-icon color="blue">
                mdi-logout
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <div class="hidden-md-and-up">
        <v-menu bottom :offset-y="true">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, i) in menu" :key="i" :to="item.link" class="text-capitalize font-weight-regular" active-class="blue--text">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      menu: [
        { link: { name: 'drinkMenu' }, title: 'Drinks Menu' },
        { link: { name: 'optionGroups' }, title: 'Option Groups' },
        { link: { name: 'drinkOptions' }, title: 'Drink Options' }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['userName'])
  },
  methods: {
    ...mapMutations('auth', ['LOGOUT_USER']),
    onLogout() {
      this.LOGOUT_USER()
      this.$router.push({ name: 'login' }).catch()
    }
  }
}
</script>

<style scoped lang="scss">
.account-btn {
  ::v-deep i.v-icon {
    min-width: 44px;
  }
  .user-name {
    padding-left: 5px;
  }
}
</style>
