import jwt from 'jsonwebtoken'

const tokenParser = (key = 'token') => {
  const getToken = localStorage.getItem('token')

  if (!getToken) {
    return null
  }
  let token
  try {
    token = JSON.parse(atob(getToken))
  } catch (error) {
    localStorage.removeItem('token')
    return null
  }
  return key === 'user' ? jwt.decode(token) : token
}

export default tokenParser
