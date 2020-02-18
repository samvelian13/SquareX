<template>
  <v-form ref="form" v-model="validForm">
    <v-card-text>
      <v-alert ref="update-mode-error" v-show="updatedDataError" transition="fade" mode="in-out" outlined dense border="left" type="error">
        No modified data.
      </v-alert>
      <v-text-field :value="name" :rules="rules.name" label="Name" clearable @change="onTypeName" />
      <v-textarea :value="drinkDescription" :rules="rules.desc" label="Description" clearable rows="1" @change="onTypeDesc" />
      <v-file-input
        :value="uploadImage"
        accept="image/png, image/jpeg, image/jpg"
        label="Upload Image"
        :rules="rules.image"
        prepend-inner-icon="mdi-camera"
        prepend-icon
        @change="onUploadImage"
      />
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
        v-model="optionGroups"
        label="Option Groups"
        :items="optionGroupsList"
        :loading="optionGroupsLoading"
        :rules="rules.optionGroups"
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
          <v-chip v-if="index < 3" close @click:close="removeSelectedOption(index, 'optionGroups')">
            <span>{{ item.name }}</span>
          </v-chip>
          <span v-if="index === 3" class="grey--text caption">(+{{ optionGroups.length - 3 }} others)</span>
        </template>
      </v-autocomplete>
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
import { mapActions, mapMutations, mapState } from 'vuex'
import dialogForm from '@/mixins/dialogForm'
import formOptionsField from '@/mixins/formOptionsField'

export default {
  name: 'DrinkForm',
  mixins: [formOptionsField, dialogForm],
  data() {
    return {
      validForm: false,
      name: null,
      drinkDescription: null,
      quantity: {
        value: null,
        unlimited: false
      },
      optionGroups: [],
      updatedDataError: false,
      uploadImage: null,
      newData: {}
    }
  },
  computed: {
    ...mapState('drinks', ['formData']),
    ...mapState('optionGroups', {
      optionGroupsList: state => state.optionGroups,
      optionGroupsLoading: state => state.optionGroupsLoading
    }),
    createRules() {
      return {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length >= 2) || 'Name must be greater than 2 characters',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'
        ],
        desc: [v => !!v || 'Description is required', v => (v && v.length <= 150) || 'Name must be less than 150 characters'],
        image: [
          v => {
            if (v) {
              const allowedFormats = ['jpeg', 'png']
              const [type, format] = v.type.split('/')
              return (type && allowedFormats.includes(format)) || `Image type is not valid, allowed types is ${allowedFormats.join(', ')}`
            }
            return 'Image is required'
          }
        ],
        quantity: [
          v => {
            if (this.quantity.unlimited) {
              return true
            }
            return !v && v !== 0 ? 'Quantity is required' : /^\d*$/.test(v) || 'Value is wrong'
          }
        ],
        optionGroups: [values => Boolean(values && values.length) || 'Option group is required']
      }
    },
    updateRules() {
      return {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length >= 2) || 'Name must be greater than 2 characters',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'
        ],
        desc: [v => !!v || 'Description is required', v => (v && v.length <= 150) || 'Name must be less than 150 characters'],
        image: [
          v => {
            if (v) {
              const allowedFormats = ['jpeg', 'png']
              const [type, format] = v.type.split('/')
              return (type && allowedFormats.includes(format)) || `Image type is not valid, allowed types is ${allowedFormats.join(', ')}`
            }
            return true
          }
        ],
        quantity: [
          v => {
            if (this.quantity.unlimited || this.quantity.value === 0) {
              return true
            }
            return !v && v !== 0 ? 'Quantity is required' : /^\d*$/.test(v) || 'Value is wrong'
          }
        ],
        optionGroups: [
          values => {
            if (!values.length) return true
            return Boolean(values && values.length) || 'Option group is required'
          }
        ]
      }
    }
  },
  watch: {
    optionGroups(newVal) {
      this.watchOptions(newVal, 'optionGroups')
    }
  },
  created() {
    if (this.isUpdateMode) {
      this.name = this.formData.name
      this.drinkDescription = this.formData.drinkDescription
      this.optionGroups = this.formData.optionGroups.slice()
      this.quantity = {
        value: this.formData.quantity || 0,
        unlimited: this.formData.quantity === null
      }
    }
    this.getOptionGroups()
  },
  methods: {
    ...mapMutations('drinks', ['DIALOG_TOGGLE']),
    ...mapActions('optionGroups', ['getOptionGroups']),
    ...mapActions('drinks', ['createDrink', 'updateDrink']),
    onTypeName(val) {
      val = val ? val.trim() : val
      if (this.isUpdateMode && this.formData.name === val) {
        this.$delete(this.newData, 'name')
        return
      }
      this.$set(this.newData, 'name', val)
    },
    onTypeDesc(val) {
      val = val ? val.trim() : val
      if (this.isUpdateMode && this.formData.drinkDescription === val) {
        this.$delete(this.newData, 'drinkDescription')
        return
      }
      this.$set(this.newData, 'drinkDescription', val)
    },
    onUploadImage(val) {
      if (val) {
        this.$set(this.newData, 'image', val)
      } else {
        this.$delete(this.newData, 'image')
      }
    },
    submitForm() {
      if (!this.validateForm()) return

      let data = {}
      if (this.newData.image) {
        data = new FormData()
        Object.keys(this.newData).forEach(key => {
          data.append(key, this.newData[key])
        })
      } else {
        data = this.newData
      }

      const submitData = {
        data
      }
      if (this.isUpdateMode) {
        submitData.updatedRowId = this.formData.id
        this.updateDrink(submitData)
        return
      }
      this.createDrink(submitData)
    }
  }
}
</script>
