export default {
  methods: {
    isTheSameOptions(val, fieldName) {
      let isTheSameIds
      if (this.isUpdateMode && Object.keys(val).length === this.formData[fieldName].length) {
        const valuesIdsArr = val.map(item => item.id)
        isTheSameIds = this.formData[fieldName].every(item => valuesIdsArr.includes(item.id))
      }
      return isTheSameIds
    },
    watchOptions(val, fieldName) {
      if (!Object.keys(val).length || this.isTheSameOptions(val, fieldName)) {
        this.$delete(this.newData, fieldName)
      } else {
        this.$set(
          this.newData,
          fieldName,
          val.map(item => item.id)
        )
      }
    },
    removeSelectedOption(index, filedName) {
      this.$delete(this[filedName], index)
    }
  }
}
