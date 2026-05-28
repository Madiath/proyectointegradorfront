import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/dashboard`

export const getDashboard = () => axiosInstance.get(BASE_URL)
