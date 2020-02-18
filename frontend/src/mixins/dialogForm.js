export default {
  computed: {
    isUpdateMode() {
      return !!this.formData
    },
    rules() {
      return this.isUpdateMode ? this.updateRules : this.createRules
    }
  },
  watch: {
    newData() {
      this.updatedDataError = !this.isValidUpdateForm()
    }
  },
  methods: {
    onTypeQuantity(val) {
      this.quantity.value = val
      if (this.isUpdateMode && this.formData.quantity === Number(val)) {
        this.$delete(this.newData, 'quantity')
        return
      }
      if (/^\d*$/.test(val)) {
        this.$set(this.newData, 'quantity', Number(val))
      }
    },
    onUnlimited(val) {
      this.quantity.unlimited = !!val
      this.$refs.form.validate()
      const newVal = !val ? Number(this.quantity.value) : null

      if (this.isUpdateMode && this.formData.quantity === newVal) {
        this.$delete(this.newData, 'quantity')
        return
      }
      this.$set(this.newData, 'quantity', newVal)
    },
    isValidUpdateForm() {
      return !!Object.keys(this.newData).length
    },
    isInViewport(el) {
      let rect = el.getBoundingClientRect()
      let elemTop = rect.top
      let elemBottom = rect.bottom

      return elemTop > 0 && elemBottom <= window.innerHeight
    },
    validateForm() {
      if (this.isUpdateMode) {
        this.updatedDataError = !this.isValidUpdateForm()
        if (this.updatedDataError) {
          const alertBox = this.$refs['update-mode-error'].$el
          if (!this.isInViewport(alertBox)) {
            this.$parent.$el.scrollIntoView({ behavior: 'smooth', inline: 'start' })
          }
        }
      }

      return this.validForm && !this.updatedDataError
    }
  }
}
