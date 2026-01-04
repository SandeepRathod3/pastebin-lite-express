import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ViewPastePage from './pages/ViewPastePage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/p/:id" element={<ViewPastePage />} />
                <Route path="*" element={
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Route not found</h1>
            <p>Current path: {window.location.pathname}</p>
          </div>
  } />
      </Routes>
    </div>
  );
}

export default App;