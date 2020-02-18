<template>
  <div class="drinks-menu">
    <v-card>
      <v-data-table
        class="elevation-1"
        :headers="datatable.headers"
        :items="drinks"
        :search="datatable.search"
        :loading="drinksLoading"
        loading-text="Loading... Please wait"
        calculate-widths
        disable-sort
        :options.sync="datatable.options"
        :server-items-length="drinks.length"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Drinks Menu</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-text-field
              :value="datatable.search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              class="mr-5"
              color="blue"
              @input="onDtbSearch"
            />
            <v-btn color="blue" outlined dark class="mb-2" @click.stop="DIALOG_TOGGLE()">
              Add
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          No data for showing
        </template>
        <template v-slot:item.drinkDescription="{ item }">
          <div class="text-truncate" :style="{ maxWidth: descColumnWidth }">
            {{ item.drinkDescription }}
          </div>
        </template>
        <template v-slot:item.quantity="{ item }">
          <div class="text-center">
            <v-chip :color="item.quantity | quantityColorFilter" class="font-weight-bold" text-color="white" small>
              {{ item.quantity | quantityTxtFilter }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.image="{ item }">
          <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="8" lg="6" xl="5">
              <v-img min-width="100" :src="imageSrc(item.image)" :lazy-src="imageSrc(item.thumbnail, true)" aspect-ratio="2" class="m-3">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="blue lighten-3" />
                  </v-row>
                </template>
              </v-img>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.optionGroups="{ item }">
          <div class="options-box text-wrap">
            <span v-for="(group, i) in item.optionGroups" :key="i" class="mr-2">
              {{ group.name }} {{ i + 1 !== item.optionGroups.length ? ',' : '' }}
            </span>
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn text icon color="blue" class="mr-2" @click="editDrink(item.id)">
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn text icon color="red" class="mr-2" @click="deleteItem(item.id)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-if="dialogOpen" :value="true" max-width="500px" persistent @keydown.esc="DIALOG_TOGGLE()">
      <v-overlay absolute="absolute" :value="dialogLoading">
        <v-progress-circular :size="50" color="primary" indeterminate />
      </v-overlay>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formType }} Drink</span>
        </v-card-title>
        <v-container>
          <drink-form />
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { APP_API_UPLOADS, APP_API_THUMBNAILS } from '@/links'
import DrinkForm from '@/views/dashboard/forms/drink.vue'
import quantityFilters from '@/mixins/quantityFilters'

export default {
  name: 'DrinkMenu',
  components: {
    DrinkForm
  },
  mixins: [quantityFilters],
  data: () => ({
    apiUploads: APP_API_UPLOADS,
    apiThumbnails: APP_API_THUMBNAILS,
    datatable: {
      headers: [
        {
          text: 'Name',
          value: 'name',
          align: 'center'
        },
        { text: 'Description', value: 'drinkDescription', align: 'center' },
        { text: 'Quantity', value: 'quantity', align: 'center' },
        { text: 'Image', value: 'image', align: 'center' },
        { text: 'Option Groups', value: 'optionGroups', align: 'left' },
        {
          text: 'Actions',
          value: 'action',
          align: 'center'
        }
      ],
      search: '',
      options: {}
    }
  }),
  computed: {
    ...mapState('drinks', ['drinks', 'drinksLoading', 'dialogLoading', 'dialogOpen', 'formData']),
    formType() {
      return this.formData ? 'Edit' : 'Add'
    },
    descColumnWidth() {
      const { width } = this.$vuetify.breakpoint

      let descWidth
      switch (true) {
        case width <= 768:
          descWidth = 100
          break
        case width <= 960:
          descWidth = 150
          break
        case width >= 1700:
          descWidth = 548
          break
        default:
          descWidth = 350
          break
      }

      return `${descWidth}px`
    }
  },
  watch: {
    'datatable.options': {
      handler() {
        this.getDrinksMenu({ ...this.datatable.options, search: this.datatable.search })
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('drinks', ['DIALOG_TOGGLE', 'ON_EDIT_DRINK_ROW']),
    ...mapActions('drinks', ['getDrinksMenu', 'deleteDrink']),
    onDtbSearch(str) {
      if (!str || str.trim()) {
        this.getDrinksMenu({ ...this.datatable.options, search: str.trim() })
      }
      this.datatable.search = str
    },
    editDrink(id) {
      const rowData = Object.assign(
        {},
        this.drinks.find(item => item.id === id)
      )

      if (Object.keys(rowData).length) {
        this.ON_EDIT_DRINK_ROW(rowData)
      }
    },
    deleteItem(id) {
      if (id) {
        this.$root.$confirmDialog.open('Confirm to delete row ?').then(confirm => {
          if (confirm) {
            this.deleteDrink(id)
          }
        })
      }
    },
    imageSrc(path, lazy = false) {
      const apiSrc = lazy ? this.apiThumbnails : this.apiUploads
      return `${apiSrc}${path}`
    }
  }
}
</script>
<style lang="scss" scoped>
.options-box {
  max-width: 700px;
}
</style>
