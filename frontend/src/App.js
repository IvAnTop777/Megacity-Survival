import React from 'react';
import Dashboard from './components/Dashboard';
import './i18n';

function App() {
  return (
    <Dashboard
      resources={{ energy: 5, crystals: 123, lifeEnergy: 27 }}
      phase={{ current: 2, total: 5, pointsToNext: 47 }}
      biometricVerified={true}
    />
  );
}

export default App;
