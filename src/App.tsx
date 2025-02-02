import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, SidebarLayout } from "./views/DashboardLayout";
import "./App.css";
import { cn } from "./lib/utils";
import { Prediction } from "./views/PredictionLayout";

function App() {
  return (
    <Router>
      <div
        className={cn(
          "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 min-h-[100vh] flex-1 border border-neutral-200 dark:border-neutral-700 overflow-y-auto overflow-x-hidden",
          "h-full"
        )}
      >
        <SidebarLayout />

        <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/prediction" element={<Prediction />} />
          {/* Other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
