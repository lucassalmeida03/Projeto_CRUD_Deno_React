import { Navigate, Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Catalog } from "./pages/Catalog";
import { MyProducts } from "./pages/MyProducts";
import { useAuth } from "./hooks/useAuth";
import { RoleRoute } from "./utils/roleRoute";

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/signIn" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/catalog"
        element={
          <RoleRoute allowedRoles={["customer", "admin"]}>
            <Catalog />
          </RoleRoute>
        }
      />
      <Route
        path="/myProducts"
        element={
          <RoleRoute allowedRoles={["seller", "admin"]}>
            <MyProducts />
          </RoleRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={user.role === "seller" ? "/myProducts" : "/catalog"}
            replace
          />
        }
      />
    </Routes>
  );
}
