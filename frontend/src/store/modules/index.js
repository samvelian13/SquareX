const requireModule = require.context('.', true, /index\.js$/)
const modules = {}

requireModule.keys().forEach(filename => {
  if (filename === './index.js') return
  const moduleName = filename.replace(/(\.\/|\/index\.js)/g, '')
  modules[moduleName] = requireModule(filename).default
})

export default modules
