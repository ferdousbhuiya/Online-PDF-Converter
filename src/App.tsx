import { Link, Route, Routes, useParams } from 'react-router-dom'
import { TOOLS } from './tools/catalog'
import { ToolRouter } from './tools/router'
import { SystemCheckPage } from './SystemCheckPage'

function HomePage() {
  return (
    <div className="app">
      <header className="header">
        <h1 className="title">PDF Toolkit</h1>
        <p className="subtitle">All-in-one local PDF tools in your browser.</p>
        <Link className="card" to="/system-check">
          <h3>System Check</h3>
          <p className="hint">Verify API, qpdf, and LibreOffice availability</p>
        </Link>
      </header>
      <div className="grid">
        {TOOLS.map((tool) => (
          <Link className="card" to={`/tool/${tool.slug}`} key={tool.slug}>
            <h3>{tool.name}</h3>
            <p className="hint">{tool.category}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ToolPage() {
  const { slug = '' } = useParams()
  return (
    <div className="app">
      <Link to="/" className="back">
        ← Back to all tools
      </Link>
      <ToolRouter slug={slug} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/system-check" element={<SystemCheckPage />} />
      <Route path="/tool/:slug" element={<ToolPage />} />
    </Routes>
  )
}