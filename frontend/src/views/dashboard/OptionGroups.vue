<template>
  <div>
    <v-card class="mx-auto" max-width="1000">
      <v-data-table
        class="elevation-1"
        :headers="datatable.headers"
        :items="optionGroups"
        :search="datatable.search"
        :loading="optionGroupsLoading"
        loading-text="Loading... Please wait"
        calculate-widths
        :options.sync="datatable.options"
        :server-items-length="optionGroups.length"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Option Groups</v-toolbar-title>
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
        <template v-slot:item.selectionType="{ item }">
          {{ item.selectionType }}
        </template>
        <template v-slot:item.isRequired="{ item }">
          <div class="text-center">
            <span>{{ item.isRequired }}</span>
          </div>
        </template>
        <template v-slot:item.quantity="{ item }">
          <div class="text-center">
            <v-chip :color="item.quantity | quantityColorFilter" class="font-weight-bold" text-color="white" small>
              {{ item.quantity | quantityTxtFilter }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.options="{ item }">
          <div class="options-box text-wrap">
            <span v-for="(op, i) in item.options" :key="i" class="mr-2"> {{ op.name }} {{ i + 1 !== item.options.length ? ',' : '' }} </span>
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
          <span class="headline">{{ formType }} Option Group</span>
          <v-spacer />
        </v-card-title>
        <option-group-form />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import OptionGroupForm from '@/views/dashboard/forms/optionGroup.vue'
import quantityFilters from '@/mixins/quantityFilters'

export default {
  name: 'OptionGroups',
  components: {
    OptionGroupForm
  },
  mixins: [quantityFilters],
  data() {
    return {
      datatable: {
        headers: [
          { text: 'Name', value: 'name', align: 'center' },
          { text: 'Selection Type', value: 'selectionType', align: 'center' },
          { text: 'Required', value: 'isRequired', align: 'center' },
          { text: 'Quantity', value: 'quantity', align: 'center' },
          { text: 'Options', value: 'options', align: 'left' },
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
    ...mapState('optionGroups', ['optionGroups', 'optionGroupsLoading', 'dialogLoading', 'dialogOpen', 'formData']),
    formType() {
      return this.formData ? 'Edit' : 'Add'
    }
  },
  watch: {
    'datatable.options': {
      handler() {
        this.getOptionGroups({ ...this.datatable.options, search: this.datatable.search })
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('optionGroups', ['DIALOG_TOGGLE', 'ON_EDIT_OP_GROUP_ROW']),
    ...mapActions('optionGroups', ['getOptionGroups', 'deleteOptionGroup']),
    onDtbSearch(str) {
      if (!str || str.trim()) {
        this.getOptionGroups({ ...this.datatable.options, search: str.trim() })
      }
      this.datatable.search = str.trim()
    },
    editOptionGroup(id) {
      const rowData = Object.assign(
        {},
        this.optionGroups.find(item => item.id === id)
      )

      if (Object.keys(rowData).length) {
        this.ON_EDIT_OP_GROUP_ROW(rowData)
      }
    },
    deleteItem(id) {
      if (id) {
        this.$root.$confirmDialog.open('Confirm to delete row ?').then(confirm => {
          if (confirm) {
            this.deleteOptionGroup(id)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.options-box {
  max-width: 400px;
}
</style>
