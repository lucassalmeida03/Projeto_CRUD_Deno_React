import { Routes, Route } from 'react-router-dom';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { Catalog } from './pages/Catalog';
import { MyProducts } from './pages/MyProducts';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignUp/>} />
        <Route path="/signIn" element={<SignIn/>} />
        <Route path='/catalog' element={<Catalog userRole="admin"/>} />
        <Route path='/myProducts' element={<MyProducts userRole='seller'/>} />
      </Routes>
    </div>
  );
}