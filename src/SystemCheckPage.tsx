import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from './config/api'

type HealthResponse = {
  ok: boolean
  binaries?: {
    qpdf?: boolean
    libreoffice?: boolean
  }
}

type StatusKind = 'ready' | 'missing' | 'offline'

type StatusRow = {
  tool: string
  dependency: string
  status: StatusKind
}

function statusLabel(kind: StatusKind) {
  if (kind === 'ready') return 'Ready'
  if (kind === 'missing') return 'Missing dependency'
  return 'API offline'
}

function statusClass(kind: StatusKind) {
  if (kind === 'ready') return 'badge ok'
  if (kind === 'missing') return 'badge warn'
  return 'badge err'
}

export function SystemCheckPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [health, setHealth] = useState<HealthResponse | null>(null)

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(apiUrl('/api/health'))
      if (!response.ok) {
        throw new Error(`Health check failed (${response.status})`)
      }
      const payload = (await response.json()) as HealthResponse
      setHealth(payload)
    } catch (err) {
      setHealth(null)
      setError(err instanceof Error ? err.message : 'Failed to reach API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const rows = useMemo<StatusRow[]>(() => {
    const qpdf = Boolean(health?.binaries?.qpdf)
    const libre = Boolean(health?.binaries?.libreoffice)
    const apiOnline = Boolean(health?.ok)

    const offline: StatusKind = 'offline'

    return [
      {
        tool: 'Protect PDF',
        dependency: 'qpdf',
        status: apiOnline ? (qpdf ? 'ready' : 'missing') : offline
      },
      {
        tool: 'Unlock PDF',
        dependency: 'qpdf',
        status: apiOnline ? (qpdf ? 'ready' : 'missing') : offline
      },
      {
        tool: 'Repair PDF',
        dependency: 'qpdf',
        status: apiOnline ? (qpdf ? 'ready' : 'missing') : offline
      },
      {
        tool: 'PowerPoint to PDF',
        dependency: 'LibreOffice',
        status: apiOnline ? (libre ? 'ready' : 'missing') : offline
      },
      {
        tool: 'PDF to Word / PowerPoint / Excel',
        dependency: 'LibreOffice',
        status: apiOnline ? (libre ? 'ready' : 'missing') : offline
      },
      {
        tool: 'PDF to Text',
        dependency: 'Backend API',
        status: apiOnline ? 'ready' : offline
      },
      {
        tool: 'OCR PDF',
        dependency: 'Backend API',
        status: apiOnline ? 'ready' : offline
      }
    ]
  }, [health])

  return (
    <div className="app">
      <Link to="/" className="back">
        ← Back to all tools
      </Link>

      <section className="tool-page">
        <h2>System Check</h2>
        <p className="hint">Checks backend health and whether required native binaries are available.</p>

        <div className="row">
          <button onClick={() => void refresh()} disabled={loading}>
            {loading ? 'Checking...' : 'Recheck'}
          </button>
          {health?.ok ? <span className="badge ok">API reachable</span> : <span className="badge err">API not reachable</span>}
        </div>

        {error ? <p className="hint">{error}</p> : null}

        <div className="status-table">
          <div className="status-head">Tool Group</div>
          <div className="status-head">Dependency</div>
          <div className="status-head">Status</div>

          {rows.map((row) => (
            <Fragment key={row.tool}>
              <div>{row.tool}</div>
              <div>{row.dependency}</div>
              <div>
                <span className={statusClass(row.status)}>{statusLabel(row.status)}</span>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="install-panel">
          <h3>Windows Install Commands</h3>
          <p className="hint">Run in PowerShell, then restart terminal and click Recheck.</p>

          <p className="hint"><strong>qpdf (required for Protect/Unlock/Repair)</strong></p>
          <pre className="code-block">winget install qpdf.qpdf</pre>

          <p className="hint"><strong>LibreOffice (required for Office/PDF conversion endpoints)</strong></p>
          <pre className="code-block">winget install TheDocumentFoundation.LibreOffice</pre>

          <p className="hint"><strong>If binaries are installed but not detected, set explicit paths:</strong></p>
          <pre className="code-block">$env:QPDF_PATH = 'C:\Program Files\qpdf\bin\qpdf.exe'
$env:LIBREOFFICE_PATH = 'C:\Program Files\LibreOffice\program\soffice.exe'
npm run dev:full</pre>
        </div>
      </section>
    </div>
  )
}
