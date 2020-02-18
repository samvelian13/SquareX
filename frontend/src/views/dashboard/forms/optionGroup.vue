<template>
  <v-form ref="form" v-model="validForm">
    <v-card-text>
      <v-container>
        <v-alert ref="update-mode-error" v-show="updatedDataError" transition="fade" mode="in-out" outlined dense border="left" type="error">
          No modified data.
        </v-alert>
        <v-text-field :value="name" :rules="rules.name" label="Name" clearable @change="onTypeName" />
        <v-radio-group :value="selectionType" :rules="rules.selectionType" row label="Selection Type" @change="onChangeSelType">
          <v-radio label="Single" value="single" />
          <v-radio label="Multiple" value="multiple" />
        </v-radio-group>
        <v-row align="center">
          <v-subheader>Is Required</v-subheader>
          <v-switch v-model="isRequired" inset :label="isRequired.toString()" :rules="rules.isRequired" class="text-capitalize" />
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              :disabled="quantity.unlimited"
              :value="quantity.value"
              :rules="rules.quantity"
              label="Quantity"
              clearable
              @change="onTypeQuantity"
            />
          </v-col>
          <v-col cols="4">
            <v-checkbox
              :value="quantity.unlimited"
              :input-value="quantity.unlimited"
              label="Unlimited"
              color="primary"
              hide-details
              @change="onUnlimited"
            />
          </v-col>
        </v-row>
        <v-autocomplete
          v-model="drinkOptions"
          label="Drink Options"
          :items="drinkOptionsList"
          :loading="drinkOptionsLoading"
          :rules="rules.drinkOptions"
          no-data-text="No found data"
          item-text="name"
          item-value="id"
          return-object
          cache-items
          clearable
          chips
          select-slot
          multiple
          autocomplete="off"
        >
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index < 3" close @click:close="removeSelectedOption(index, 'drinkOptions')">
              <span>{{ item.name }}</span>
            </v-chip>
            <span v-if="index === 3" class="grey--text caption">(+{{ drinkOptions.length - 3 }} others)</span>
          </template>
        </v-autocomplete>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue darken-1" text @click="DIALOG_TOGGLE()">
        Cancel
      </v-btn>
      <v-btn :disabled="!validForm" color="blue darken-1" text @click="submitForm">
        Save
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import dialogForm from '@/mixins/dialogForm'
import formOptionsField from '@/mixins/formOptionsField'

export default {
  name: 'OptionGroupForm',
  mixins: [formOptionsField, dialogForm],
  data() {
    return {
      validForm: false,
      name: null,
      selectionType: null,
      isRequired: false,
      quantity: {
        value: null,
        unlimited: false
      },
      drinkOptions: [],
      updatedDataError: false,
      newData: {}
    }
  },
  computed: {
    ...mapState('optionGroups', ['formData']),
    ...mapState('drinkOptions', {
      drinkOptionsList: state => state.drinkOptions,
      drinkOptionsLoading: state => state.drinkOptionsLoading
    }),
    createRules() {
      return {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length >= 2) || 'Name must be greater than 2 characters',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'
        ],
        selectionType: [
          v => !!v || 'Selection type is required',
          v => {
            const types = ['single', 'multiple']
            return types.includes(v) || `Selection type value must be ${types.join(' or ')}`
          }
        ],
        isRequired: [v => typeof v === 'boolean' || 'Is Required field is required'],
        quantity: [
          v => {
            if (this.quantity.unlimited) {
              return true
            }
            return !v ? 'Quantity is required' : /^\d*$/.test(v) || 'Value is wrong'
          }
        ],
        drinkOptions: [values => Boolean(values && values.length) || 'Drink options is required']
      }
    },
    updateRules() {
      return {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length >= 2) || 'Name must be greater than 2 characters',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'
        ],
        selectionType: [v => v.length <= 100 || 'Description must be less than 100 characters'],
        isRequired: [v => typeof v === 'boolean' || 'Is Required field is required'],
        quantity: [
          v => {
            if (this.quantity.unlimited || this.quantity.value === 0) {
              return true
            }
            return !v ? 'Quantity is required' : /^\d*$/.test(v) || 'Value is wrong'
          }
        ],
        drinkOptions: [
          values => {
            if (!values.length) return true
            return Boolean(values && values.length) || 'Drink option is required'
          }
        ]
      }
    }
  },
  watch: {
    isRequired(val) {
      if (this.isUpdateMode && this.formData.isRequired === val) {
        this.$delete(this.newData, 'isRequired')
      } else {
        this.$set(this.newData, 'isRequired', val)
      }
    },
    drinkOptions(newVal) {
      this.watchOptions(newVal, 'options')
    }
  },
  created() {
    if (this.isUpdateMode) {
      this.name = this.formData.name
      this.selectionType = this.formData.selectionType
      this.isRequired = this.formData.isRequired
      this.drinkOptions = this.formData.options.slice()
      this.quantity = {
        value: this.formData.quantity || 0,
        unlimited: this.formData.quantity === null
      }
    }
    this.getDrinkOptions()
  },
  methods: {
    ...mapMutations('optionGroups', ['DIALOG_TOGGLE']),
    ...mapActions('optionGroups', ['createOptionGroup', 'updateOptionGroup']),
    ...mapActions('drinkOptions', ['getDrinkOptions']),
    onTypeName(val) {
      val = val ? val.trim() : val
      if (this.isUpdateMode && this.formData.name === val) {
        this.$delete(this.newData, 'name')
        return
      }
      this.$set(this.newData, 'name', val)
    },
    onChangeSelType(val) {
      if (this.isUpdateMode && this.formData.selectionType === val) {
        this.$delete(this.newData, 'selectionType')
        return
      }
      this.$set(this.newData, 'selectionType', val)
    },
    submitForm() {
      if (!this.validateForm()) return

      if (this.isUpdateMode) {
        const submitData = {
          data: this.newData,
          updatedRowId: this.formData.id
        }
        this.updateOptionGroup(submitData)
        return
      }
      if (this.newData.isRequired === undefined) {
        this.$set(this.newData, 'isRequired', this.isRequired)
      }
      this.createOptionGroup(this.newData)
    }
  }
}
</script>
