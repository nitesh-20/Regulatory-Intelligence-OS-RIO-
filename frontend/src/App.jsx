import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Feed from './pages/Feed'
import AskImpact from './pages/AskImpact'
import ComplianceTwin from './pages/ComplianceTwin'
import AuditSimulator from './pages/AuditSimulator'
import PolicyDiff from './pages/PolicyDiff'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="feed" element={<Feed />} />
          <Route path="ask" element={<AskImpact />} />
          <Route path="twin" element={<ComplianceTwin />} />
          <Route path="audit" element={<AuditSimulator />} />
          <Route path="diff" element={<PolicyDiff />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
