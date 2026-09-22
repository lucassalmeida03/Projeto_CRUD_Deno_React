import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Register/>} />
      </Routes>
    </div>
  );
}