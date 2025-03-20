import "./CourseForm.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChainReview_backend } from "../../declarations/ChainReview_backend";
import { useAuth } from "./use-auth-client";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastError, setLastError] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const { principal } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      await ChainReview_backend.addCourse(title);
      navigate("/");
    } catch (error: any) {
      const errorText: string = error.toString();
      setLastError(errorText);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-course">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Course title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter course title"
            required
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          style={{ opacity: saving ? 0.5 : 1 }}
        >
          Submit Course
        </button>
        {lastError != null && <p className="error-message">{lastError}</p>}
      </form>
    </div>
  );
}

export default CreateCourse;
