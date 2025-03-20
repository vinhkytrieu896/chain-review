import "./CourseDetail.scss";
import { useEffect, useState } from "react";
import { CourseDetail } from "../../declarations/ChainReview_backend/ChainReview_backend.did";
import { useParams } from "react-router-dom";
import { useAuth } from "./use-auth-client";
import { ChainReview_backend } from "../../declarations/ChainReview_backend";

function CourseDetailPage() {
  const { id } = useParams();
  const courseId = BigInt(id as string);

  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [course, setCourse] = useState<CourseDetail | undefined>();
  const [lastError, setLastError] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const { principal, isAuthenticated } = useAuth();

  const fetchFromBackend = async () => {
    setCourse(await ChainReview_backend.getCourseDetail(courseId));
  };

  useEffect(() => {
    fetchFromBackend();
  }, [courseId]);

  if (!course) {
    return <p>Loading course details...</p>;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setSaving(true);
      await ChainReview_backend.rateCourse(
        courseId,
        BigInt(newRating),
        newReview
      );
      setLastError(undefined);
      setNewReview("");
      setNewRating(5);
      fetchFromBackend();
    } catch (error: any) {
      const errorText: string = error.toString();
      setLastError(errorText);
    } finally {
      setSaving(false);
    }
  };

  if (!course) return <p>Loading...</p>;

  const averageRating = course.countRating
    ? (Number(course.sumRating) / Number(course.countRating)).toFixed(1)
    : "No ratings yet";

  return (
    <div className="course-detail">
      <h2 className="course-title">{course.title}</h2>
      <p className="course-rating">Average Rating: {averageRating} / 5</p>

      <h3>Rate this Course:</h3>
      <form className="review-form" onSubmit={handleSubmit}>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review..."
          required
        />
        <select
          value={newRating}
          onChange={(e) => setNewRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          style={{
            opacity: saving ? 0.5 : 1,
          }}
        >
          Submit Review
        </button>
        {lastError != null && <p className="error-message">{lastError}</p>}
      </form>

      <h3>Reviews:</h3>
      <ul className="reviews-list">
        {course.userReview.length > 0 ? (
          course.userReview.map((review, index) => (
            <li key={index} className="review-item">
              <p className="review-content">{review.content}</p>
              <p className="review-rate">Rating: {Number(review.rate)} / 5</p>
              <p className="review-date">
                {new Date(Number(review.created) / 1_000_000).toLocaleString()}
              </p>
              <p className="review-reviewer">By {review.reviewer.toString()}</p>
            </li>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </ul>
    </div>
  );
}

export default CourseDetailPage;
