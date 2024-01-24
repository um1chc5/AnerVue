import type { AxiosInstance } from 'axios'
import axios from 'axios'

class HTTP {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://ro1zm49hue.execute-api.ap-southeast-2.amazonaws.com/test/kanbanResource/',
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
}

const http = new HTTP().instance

export default http
