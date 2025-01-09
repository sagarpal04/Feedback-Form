import { Routes, Route } from "react-router-dom";
import AdminPanel from "./AdminPanel"; // Admin panel component
import FeedbackForm from "./FeedbackForm";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  );
};

export default App;
