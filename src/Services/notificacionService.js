import * as signalR from '@microsoft/signalr'
import axiosInstance from './axiosInstance'
import API_BASE_URL from './config'

const BASE_URL = `${API_BASE_URL}/api/Notificaciones`
const HUB_URL = `${API_BASE_URL}/hubs/notificaciones`

export const listarNotificaciones = () => axiosInstance.get(BASE_URL)

export const contarNotificacionesNoLeidas = () =>
  axiosInstance.get(`${BASE_URL}/no-leidas`)

export const marcarNotificacionLeida = (id) =>
  axiosInstance.put(`${BASE_URL}/${id}/leida`)

export const marcarTodasNotificacionesLeidas = () =>
  axiosInstance.put(`${BASE_URL}/leidas`)

export const crearConexionNotificaciones = () =>
  new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => localStorage.getItem('token') || '',
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .build()
