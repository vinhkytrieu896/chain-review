import "./App.scss";
import CourseForm from "./CourseForm";
import CourseList from "./CourseList";
import Navigation from "./Navigation";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CourseDetail from "./CourseDetail";
import { AuthProvider } from "./use-auth-client";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <h1>Review platform</h1>
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/newCourse" element={<CourseForm />} />
            <Route path="/viewCourse/:id" element={<CourseDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
