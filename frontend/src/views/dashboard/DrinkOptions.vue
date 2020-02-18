<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-card class="mx-auto" width="800">
      <v-data-table
        class="elevation-1"
        :headers="datatable.headers"
        :items="drinkOptions"
        :search="datatable.search"
        :loading="drinkOptionsLoading"
        loading-text="Loading... Please wait"
        calculate-widths
        :options.sync="datatable.options"
        :server-items-length="drinkOptions.length"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Drink Options</v-toolbar-title>
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
        <template v-slot:item.price="{ item }">
          <span v-if="Number(item.price)">$ {{ item.price }}</span>
          <span v-else>-</span>
        </template>
        <template v-slot:item.quantity="{ item }">
          <div class="text-center">
            <v-chip :color="item.quantity | quantityColorFilter" class="font-weight-bold" text-color="white" small>
              {{ item.quantity | quantityTxtFilter }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn text icon color="blue" class="mr-2" @click="editOptionGroup(item.id)">
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
          <span class="headline">{{ formType }} Drink Option</span>
          <v-spacer />
        </v-card-title>
        <drink-option-form />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DrinkOptionForm from '@/views/dashboard/forms/drinkOption.vue'
import quantityFilters from '@/mixins/quantityFilters'

export default {
  name: 'DrinkOptions',
  components: {
    DrinkOptionForm
  },
  mixins: [quantityFilters],
  data() {
    return {
      datatable: {
        headers: [
          {
            text: 'Name',
            value: 'name',
            align: 'center'
          },
          {
            text: 'Price',
            value: 'price',
            align: 'center'
          },
          { text: 'Quantity', value: 'quantity', align: 'center' },
          {
            text: 'Actions',
            value: 'action',
            align: 'center'
          }
        ],
        search: '',
        options: {}
      }
    }
  },
  computed: {
    ...mapState('drinkOptions', ['drinkOptions', 'drinkOptionsLoading', 'dialogLoading', 'dialogOpen', 'formData']),
    formType() {
      return this.formData ? 'Edit' : 'Add'
    }
  },
  watch: {
    'datatable.options': {
      handler() {
        this.getDrinkOptions({ ...this.datatable.options, search: this.datatable.search })
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('drinkOptions', ['DIALOG_TOGGLE', 'ON_EDIT_DRINK_OPTION_ROW']),
    ...mapActions('drinkOptions', ['getDrinkOptions', 'deleteDrinkOption']),
    onDtbSearch(str) {
      if (!str || str.trim()) {
        this.getDrinkOptions({ ...this.datatable.options, search: str.trim() })
      }
      this.datatable.search = str.trim()
    },
    editOptionGroup(id) {
      const rowData = Object.assign(
        {},
        this.drinkOptions.find(item => item.id === id)
      )

      if (Object.keys(rowData).length) {
        this.ON_EDIT_DRINK_OPTION_ROW(rowData)
      }
    },
    deleteItem(id) {
      if (id) {
        this.$root.$confirmDialog.open('Confirm to delete row ?').then(confirm => {
          if (confirm) {
            this.deleteDrinkOption(id)
          }
        })
      }
    }
  }
}
</script>
