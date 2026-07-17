import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import AskImpact from './pages/AskImpact';
import ComplianceTwin from './pages/ComplianceTwin';
import PolicyDiff from './pages/PolicyDiff';
import AgentsPanel from './pages/AgentsPanel';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="feed" element={<Feed />} />
          <Route path="chat" element={<AskImpact />} />
          <Route path="twin" element={<ComplianceTwin />} />
          <Route path="diff" element={<PolicyDiff />} />
          <Route path="agents" element={<AgentsPanel />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
