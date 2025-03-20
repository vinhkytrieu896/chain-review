import "./CourseList.scss";
import { useEffect, useState } from "react";
import { CourseSummary } from "../../declarations/ChainReview_backend/ChainReview_backend.did";
import { useNavigate } from "react-router-dom";
import { ChainReview_backend } from "../../declarations/ChainReview_backend";

function CourseList() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const navigate = useNavigate();

  const fetchCourse = async () => {
    const result = await ChainReview_backend.getAllCourse();
    setCourses(result);
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  if (!courses || courses.length === 0) {
    return <p>No courses available.</p>;
  }

  return (
    <div className="course-summary-list">
      {courses.map((course) => {
        const averageRating = course.countRating
          ? (Number(course.sumRating) / Number(course.countRating)).toFixed(1)
          : "No ratings yet";
        return (
          <div
            key={course.id}
            className="course-summary"
            onClick={() => navigate(`/viewCourse/${course.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="course-title">{course.title}</h3>
            <p className="course-rating">Average Rating: {averageRating} / 5</p>
            <p className="course-no-reviews">
              Number of reviews: {Number(course.countRating)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default CourseList;
