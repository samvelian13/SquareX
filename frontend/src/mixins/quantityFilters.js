export default {
  filters: {
    quantityTxtFilter(value) {
      switch (value) {
        case null:
          return 'Unlimited'
        case 0:
          return 'Sold Out'
        default:
          return value
      }
    },
    quantityColorFilter(value) {
      return value === 0 ? 'red' : value === null ? 'warning' : 'blue'
    }
  }
}
