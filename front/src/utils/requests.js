import Cookies from 'js-cookie'

export const getAuthHeader = () => {
  const session_id = Cookies.get('session_id')
  if (session_id) {
    const headers = {
      Authorization: session_id
    }
    return headers
  }
  return {}
}


