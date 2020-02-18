const APP_API_UPLOADS = process.env.VUE_APP_API_UPLOADS
const APP_API_THUMBNAILS = `${APP_API_UPLOADS}thumbnails/`

const DRINKS_DEF = 'drinks'
const LOGIN_LINK = 'auth/login'
const LOGOUT_LINK = 'auth/logout'

const DRINKS_LINK = {
  GET: DRINKS_DEF,
  CREATE: `${DRINKS_DEF}/create`,
  UPDATE: `${DRINKS_DEF}/update/`,
  DELETE: `${DRINKS_DEF}/delete/`
}

const OPTION_GROUPS_DEF = 'drink/option-groups'
const OPTION_GROUPS_LINK = {
  GET: OPTION_GROUPS_DEF,
  CREATE: `${OPTION_GROUPS_DEF}/create`,
  UPDATE: `${OPTION_GROUPS_DEF}/update/`,
  DELETE: `${OPTION_GROUPS_DEF}/delete/`
}
const DRINK_OPTION_DEF = 'drink/option-groups/options'
const DRINK_OPTION_LINK = {
  GET: DRINK_OPTION_DEF,
  CREATE: `${DRINK_OPTION_DEF}/create`,
  UPDATE: `${DRINK_OPTION_DEF}/update/`,
  DELETE: `${DRINK_OPTION_DEF}/delete/`
}

export { APP_API_UPLOADS, APP_API_THUMBNAILS, LOGIN_LINK, LOGOUT_LINK, DRINKS_LINK, OPTION_GROUPS_LINK, DRINK_OPTION_LINK }
