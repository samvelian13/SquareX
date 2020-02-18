<template>
  <v-form ref="form" v-model="validForm">
    <v-card-text>
      <v-container>
        <v-alert ref="update-mode-error" v-show="updatedDataError" transition="fade" mode="in-out" outlined dense border="left" type="error">
          No modified data.
        </v-alert>
        <v-text-field :value="name" :rules="rules.name" label="Name" clearable @change="onTypeName" />
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
        <v-text-field
          :value="price"
          :rules="rules.price"
          hint="The value must be positive or leave it empty if you do not want the price to be"
          label="Price"
          clearable
          @change="onTypePrice"
        />
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

export default {
  name: 'DrinkOptionForm',
  mixins: [dialogForm],
  data() {
    return {
      validForm: true,
      name: null,
      price: null,
      quantity: {
        value: null,
        unlimited: false
      },
      updatedDataError: false,
      newData: {}
    }
  },
  computed: {
    ...mapState('drinkOptions', ['formData']),
    createRules() {
      return {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length >= 2) || 'Name must be greater than 2 characters',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'
        ],
        price: [
          v => {
            if (!v) {
              return true
            }
            return /^\d{1,8}(?:\.\d*)?$/.test(v) || 'Value is wrong'
          }
        ],
        quantity: [
          v => {
            if (this.quantity.unlimited) {
              return true
            }
            return !v ? 'Quantity is required' : /^\d*$/.test(v) || 'Value is wrong'
          }
        ]
      }
    },
    updateRules() {
      return {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length >= 2) || 'Name must be greater than 2 characters',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'
        ],
        price: [
          v => {
            if (!v) {
              return true
            }

            return /^\d{1,8}(?:\.\d*)?$/.test(v) || 'Value is wrong'
          }
        ],
        quantity: [
          v => {
            if (this.quantity.unlimited || this.quantity.value === 0) {
              return true
            }
            return !v ? "Quantity can't be empty" : /^\d*$/.test(v) || 'Value is wrong'
          }
        ]
      }
    }
  },
  created() {
    if (this.isUpdateMode) {
      this.name = this.formData.name
      this.price = this.formData.price || null
      this.quantity = {
        value: this.formData.quantity || 0,
        unlimited: this.formData.quantity === null
      }
    }
  },
  methods: {
    ...mapMutations('drinkOptions', ['DIALOG_TOGGLE']),
    ...mapActions('drinkOptions', ['createDrinkOption', 'updateDrinkOption']),
    onTypeName(val) {
      val = val ? val.trim() : val
      if (this.isUpdateMode && this.formData.name === val) {
        this.$delete(this.newData, 'name')
        return
      }
      this.$set(this.newData, 'name', val)
    },
    onTypePrice(val) {
      if (this.isUpdateMode && this.formData.price === val) {
        this.$delete(this.newData, 'price')
        return
      }
      if (!val || /^\d{1,8}(?:\.\d*)?$/.test(val)) {
        this.$set(this.newData, 'price', val ? Number(val).toFixed(2) : null)
      }
    },
    submitForm() {
      if (!this.validateForm()) return

      if (this.isUpdateMode) {
        const submitData = {
          data: this.newData,
          updatedRowId: this.formData.id
        }
        this.updateDrinkOption(submitData)
        return
      }

      this.createDrinkOption(this.newData)
    }
  }
}
</script>
