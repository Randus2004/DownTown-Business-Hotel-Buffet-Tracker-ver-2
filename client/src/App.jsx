import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Sessions from "./pages/Sessions/SessionsList";
import Upload from "./pages/Upload/Upload";
import SessionDetails from "./pages/Sessions/SessionDetails";



// With this
import StaffPage from "./pages/Staff/StaffPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/sessions" element={<Sessions />} />

        <Route
          path="/sessions/:id"
          element={<SessionDetails />}
        />

        <Route
          path="/upload/:sessionId"
          element={<Upload />}
        />

        <Route
          path="/staff/:sessionCode"
          element={<StaffPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;