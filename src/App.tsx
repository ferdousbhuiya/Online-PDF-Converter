import { Link, Route, Routes, useParams } from 'react-router-dom'
import { TOOLS } from './tools/catalog'
import { ToolRouter } from './tools/router'
import { SystemCheckPage } from './SystemCheckPage'

const CATEGORY_ORDER = [
  'Organize PDF',
  'Optimize PDF',
  'Convert to PDF',
  'Convert from PDF',
  'Edit PDF',
  'Security PDF',
  'Advanced PDF'
]

function HomePage() {
  const grouped = CATEGORY_ORDER
    .map((category) => ({
      category,
      tools: TOOLS.filter((tool) => tool.category === category)
    }))
    .filter((entry) => entry.tools.length > 0)

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Online PDF Converter</p>
          <h1 className="title">Professional PDF Toolkit</h1>
          <p className="subtitle">Use organized tools for convert, edit, secure, and optimize workflows.</p>
        </div>
        <Link className="system-check-card" to="/system-check">
          <h3>System Check</h3>
          <p className="hint">Verify API, qpdf, LibreOffice, and redaction dependencies.</p>
        </Link>
      </header>

      {grouped.map((group) => (
        <section key={group.category} className="tool-section">
          <h2 className="section-title">{group.category}</h2>
          <div className="grid">
            {group.tools.map((tool) => (
              <Link className="card tool-card" to={`/tool/${tool.slug}`} key={tool.slug}>
                <h3>{tool.name}</h3>
                <p className="hint">Open tool</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
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