import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { DecisionProvider } from "./context/DecisionContext";
import Home from "./screens/Home";
import Capture from "./screens/Capture";
import Classify from "./screens/Classify";
import Processing from "./screens/Processing";
import Results from "./screens/Results";
import Verdict from "./screens/Verdict";
import Brief from "./screens/Brief";
import History from "./screens/History";
import Library from "./screens/Library";

export default function App() {
  return (
    <DecisionProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decision/new" element={<Capture />} />
          <Route path="/decision/classify" element={<Classify />} />
          <Route path="/decision/processing" element={<Processing />} />
          <Route path="/decision/results" element={<Results />} />
          <Route path="/decision/verdict" element={<Verdict />} />
          <Route path="/decision/brief" element={<Brief />} />
          <Route path="/history" element={<History />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </AppShell>
    </DecisionProvider>
  );
}
