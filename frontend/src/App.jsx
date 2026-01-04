import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ViewPastePage from './pages/ViewPastePage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/p/:id" element={<ViewPastePage />} />
      </Routes>
    </div>
  );
}

export default App;