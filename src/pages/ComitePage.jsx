import { useState, useEffect } from 'react'
import {
  Gavel, CheckCircle2, AlertTriangle, XCircle, Search, DollarSign, Calendar, Percent
} from 'lucide-react'
import PageHead from '../components/layout/PageHead.jsx'
import Card from '../components/ui/Card.jsx'
import Alert from '../components/ui/Alert.jsx'
import Badge from '../components/ui/Badge.jsx'
import Money from '../components/ui/Money.jsx'
import { listarSolicitudesComite, registrarDecisionComite } from '../services/solicitudesService.js'
import { extractError, toNumber } from '../utils/format.js'

export default function ComitePage() {
  const [solicitudes, setSolicitudes] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Form de decisión
  const [decision, setDecision] = useState('APROBADO_COMITE')
  const [montoAprobado, setMontoAprobado] = useState('')
  const [observacion, setObservacion] = useState('')

  const fetchSolicitudes = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listarSolicitudesComite()
      setSolicitudes(data)
      // Resetear seleccionada si ya no está en la lista
      if (seleccionada) {
        const sigue = data.find(s => s.id === seleccionada.id)
        if (!sigue) setSeleccionada(null)
      }
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  const selectSolicitud = (s) => {
    setSeleccionada(s)
    setDecision('APROBADO_COMITE')
    setMontoAprobado(String(s.monto_solicitado))
    setObservacion('')
    setSuccess(null)
    setError(null)
  }

  const guardarDecision = async (e) => {
    e.preventDefault()
    if (!seleccionada) return
    setError(null)
    setSuccess(null)

    if (decision === 'CONDICIONADO') {
      const monto = toNumber(montoAprobado)
      if (monto <= 0) {
        setError('El monto aprobado debe ser mayor a 0.')
        return
      }
      if (monto > seleccionada.monto_solicitado) {
        setError('El monto aprobado no puede ser mayor al monto solicitado original.')
        return
      }
      if (!observacion.trim()) {
        setError('Debe especificar la condición o motivo de la reducción de monto.')
        return
      }
    }

    if (decision === 'RECHAZADO' && !observacion.trim()) {
      setError('Debe especificar el motivo del rechazo.')
      return
    }

    setSubmitLoading(true)
    try {
      await registrarDecisionComite(seleccionada.id, {
        decision,
        monto_aprobado: decision === 'CONDICIONADO' ? toNumber(montoAprobado) : undefined,
        observacion: observacion.trim() || 'Aprobado sin observaciones adicionales'
      })
      setSuccess('Se registró la decisión del comité exitosamente.')
      fetchSolicitudes()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <>
      <PageHead
        title="Bandeja de Comité"
        subtitle="Evaluación y toma de decisiones sobre solicitudes de crédito microempresarial."
        icon={Gavel}
      />

      {error && !seleccionada && <Alert tipo="error">{error}</Alert>}

      <div className="hb-grid-3" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: 20 }}>
        {/* PANEL IZQUIERDO: LISTA DE SOLICITUDES PENDIENTES */}
        <Card title={`Solicitudes Pendientes (${solicitudes.length})`} icon={Search}>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--hb-muted)' }}>Cargando solicitudes…</div>
          ) : solicitudes.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--hb-muted)' }}>
              No hay solicitudes pendientes de decisión de comité.
            </div>
          ) : (
            <div className="cm-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {solicitudes.map((s) => {
                const isSelected = seleccionada?.id === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => selectSolicitud(s)}
                    className="cm-list-item"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '14px 18px',
                      borderRadius: 16,
                      border: isSelected ? '2px solid var(--hb-red)' : '1px solid var(--hb-border)',
                      background: isSelected ? '#fff8f8' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: 14, color: 'var(--hb-text-primary)' }}>
                        {s.numero_expediente}
                      </span>
                      <Badge estado={s.estado} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--hb-text-secondary)', marginTop: 4 }}>
                      {s.cliente_nombre}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--hb-muted)' }}>
                      <span>Monto: <strong>S/ {s.monto_solicitado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong></span>
                      <span>Plazo: <strong>{s.plazo_meses} meses</strong></span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        {/* PANEL DERECHO: DETALLE Y FORMULARIO DE DECISIÓN */}
        <div>
          {seleccionada ? (
            <Card title={`Evaluar Expediente: ${seleccionada.numero_expediente}`} icon={Gavel}>
              {success && <Alert tipo="success">{success}</Alert>}
              {error && <Alert tipo="error">{error}</Alert>}

              {/* Ficha de Detalles de la Solicitud */}
              <div
                style={{
                  background: '#fcfcfc',
                  border: '1px solid var(--hb-border)',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20
                }}
              >
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, borderBottom: '1px solid var(--hb-border)', paddingBottom: 8 }}>
                  Ficha del Expediente
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 13.5 }}>
                  <div>
                    <span style={{ color: 'var(--hb-muted)', display: 'block' }}>Cliente</span>
                    <strong>{seleccionada.cliente_nombre}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--hb-muted)', display: 'block' }}>DNI / RUC</span>
                    <strong>{seleccionada.cliente_documento}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--hb-muted)', display: 'block' }}>Monto Solicitado</span>
                    <strong style={{ color: 'var(--hb-red)', fontSize: 15 }}>
                      S/ {seleccionada.monto_solicitado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--hb-muted)', display: 'block' }}>Plazo Solicitado</span>
                    <strong>{seleccionada.plazo_meses} meses</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--hb-muted)', display: 'block' }}>TEA Referencial</span>
                    <strong>{seleccionada.tasa_anual}%</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--hb-muted)', display: 'block' }}>Cuota Mensual Estimada</span>
                    <strong>S/ {seleccionada.cuota_mensual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>
              </div>

              {/* Formulario de Decisión */}
              <form onSubmit={guardarDecision}>
                <div className="hb-field">
                  <label style={{ fontWeight: 'bold' }}>Decisión del Comité</label>
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => setDecision('APROBADO_COMITE')}
                      style={{
                        flex: 1,
                        padding: '12px 8px',
                        borderRadius: 12,
                        border: decision === 'APROBADO_COMITE' ? '2px solid #16a34a' : '1px solid var(--hb-border)',
                        background: decision === 'APROBADO_COMITE' ? '#eafaf1' : '#fff',
                        color: decision === 'APROBADO_COMITE' ? '#16a34a' : 'var(--hb-text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s'
                      }}
                    >
                      <CheckCircle2 size={20} />
                      Aprobar
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecision('CONDICIONADO')}
                      style={{
                        flex: 1,
                        padding: '12px 8px',
                        borderRadius: 12,
                        border: decision === 'CONDICIONADO' ? '2px solid #d97706' : '1px solid var(--hb-border)',
                        background: decision === 'CONDICIONADO' ? '#fffbeb' : '#fff',
                        color: decision === 'CONDICIONADO' ? '#d97706' : 'var(--hb-text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s'
                      }}
                    >
                      <AlertTriangle size={20} />
                      Condicionar
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecision('RECHAZADO')}
                      style={{
                        flex: 1,
                        padding: '12px 8px',
                        borderRadius: 12,
                        border: decision === 'RECHAZADO' ? '2px solid var(--hb-red)' : '1px solid var(--hb-border)',
                        background: decision === 'RECHAZADO' ? '#fdf2f2' : '#fff',
                        color: decision === 'RECHAZADO' ? 'var(--hb-red)' : 'var(--hb-text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s'
                      }}
                    >
                      <XCircle size={20} />
                      Rechazar
                    </button>
                  </div>
                </div>

                {/* Monto Aprobado (solo si es CONDICIONADO) */}
                {decision === 'CONDICIONADO' && (
                  <div className="hb-field" style={{ animation: 'fadeIn 0.2s ease' }}>
                    <label style={{ fontWeight: 'bold' }}>Monto Aprobado (S/)</label>
                    <input
                      type="number"
                      className="hb-input"
                      style={{ marginTop: 6 }}
                      placeholder="0.00"
                      value={montoAprobado}
                      onChange={(e) => setMontoAprobado(e.target.value)}
                    />
                    <small style={{ color: 'var(--hb-muted)', display: 'block', marginTop: 4 }}>
                      Debe ser menor al monto solicitado de S/ {seleccionada.monto_solicitado.toLocaleString('es-PE')}
                    </small>
                  </div>
                )}

                {/* Observaciones o Motivos */}
                <div className="hb-field">
                  <label style={{ fontWeight: 'bold' }}>
                    {decision === 'RECHAZADO' ? 'Motivo del Rechazo' : decision === 'CONDICIONADO' ? 'Condición y Sustento' : 'Observaciones'}
                  </label>
                  <textarea
                    className="hb-input"
                    style={{ marginTop: 6, minHeight: 80, resize: 'vertical' }}
                    placeholder={
                      decision === 'RECHAZADO' 
                        ? 'Explique detalladamente el motivo de rechazo...' 
                        : decision === 'CONDICIONADO' 
                          ? 'Sustente por qué se aprueba un monto menor...' 
                          : 'Observaciones internas adicionales...'
                    }
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                  />
                </div>

                <div style={{ marginTop: 24 }}>
                  <button
                    type="submit"
                    className="hb-btn"
                    disabled={submitLoading}
                    style={{
                      width: '100%',
                      background: decision === 'RECHAZADO' ? 'var(--hb-red)' : decision === 'CONDICIONADO' ? '#d97706' : '#16a34a',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 15,
                      padding: '14px',
                      borderRadius: 16,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <Gavel size={18} />
                    {submitLoading ? 'Registrando Decisión…' : 'Registrar Decisión del Comité'}
                  </button>
                </div>
              </form>
            </Card>
          ) : (
            <div
              style={{
                border: '2px dashed var(--hb-border)',
                borderRadius: 24,
                padding: '80px 40px',
                textAlign: 'center',
                color: 'var(--hb-muted)'
              }}
            >
              <Gavel size={48} style={{ strokeWidth: 1, marginBottom: 16, color: 'var(--hb-muted)' }} />
              <h3>Evaluación del Comité</h3>
              <p style={{ maxWidth: 320, margin: '8px auto 0 auto', fontSize: 13.5 }}>
                Selecciona un expediente de la lista de pendientes para ver los detalles y registrar la decisión final.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
