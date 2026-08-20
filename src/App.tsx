import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DecisionProvider } from "./context/DecisionContext";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Classify from "./screens/Classify";
import Processing from "./screens/Processing";
import Results from "./screens/Results";
import Verdict from "./screens/Verdict";
import Brief from "./screens/Brief";
import History from "./screens/History";
import Library from "./screens/Library";

function LoginRoute() {
  const { currentProfile } = useAuth();
  if (currentProfile) return <Navigate to="/" replace />;
  return <Login />;
}

function AuthedApp() {
  const { currentProfile } = useAuth();
  if (!currentProfile) return <Navigate to="/login" replace />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decision/classify" element={<Classify />} />
        <Route path="/decision/processing" element={<Processing />} />
        <Route path="/decision/results" element={<Results />} />
        <Route path="/decision/verdict" element={<Verdict />} />
        <Route path="/decision/brief" element={<Brief />} />
        <Route path="/history" element={<History />} />
        <Route path="/library" element={<Library />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DecisionProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/*" element={<AuthedApp />} />
        </Routes>
      </DecisionProvider>
    </AuthProvider>
  );
}
