import api from './api.js'

/** Historial / tablero de solicitudes del asesor. GET /solicitudes */
export async function listarSolicitudes() {
  const { data } = await api.get('/solicitudes')
  return data
}

/** Crea una solicitud de crédito. POST /solicitudes */
export async function crearSolicitud(payload) {
  const { data } = await api.post('/solicitudes', payload)
  return data
}

/** Notas internas de una solicitud. GET /solicitudes/{id}/notas */
export async function listarNotas(solicitudId) {
  const { data } = await api.get(`/solicitudes/${solicitudId}/notas`)
  return data
}

/** Agrega una nota interna. POST /solicitudes/{id}/notas */
export async function agregarNota(solicitudId, contenido) {
  const { data } = await api.post(`/solicitudes/${solicitudId}/notas`, { contenido })
  return data
}

/** Listar solicitudes para Comité. GET /comite/solicitudes (RV-07) */
export async function listarSolicitudesComite() {
  const { data } = await api.get('/comite/solicitudes')
  return data
}

/** Registrar decisión del Comité. POST /comite/solicitudes/{id}/decidir (RV-07) */
export async function registrarDecisionComite(solicitudId, { decision, monto_aprobado, observacion }) {
  const { data } = await api.post(`/comite/solicitudes/${solicitudId}/decidir`, {
    decision,
    monto_aprobado,
    observacion
  })
  return data
}
