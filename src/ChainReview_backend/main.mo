import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Map "mo:motoko-hash-map/Map";

actor class Registry() {
  type Review = {
    reviewer : Principal;
    rate : Nat;
    content : Text;
    created : Time.Time;
  };

  type CourseSummary = {
    id : Nat;
    title : Text;
    sumRating : Nat;
    countRating : Nat;
  };

  type Course = CourseSummary and {
    userReview : Map.Map<Principal, Review>;
  };

  type CourseDetail = CourseSummary and {
    userReview : [Review];
  };

  let { nhash; phash } = Map;

  stable var nextCourseId : Nat = 1;
  stable let courses : Map.Map<Nat, Course> = Map.new();

  public shared ({ caller }) func addCourse(title : Text) : async () {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    let newCourse : Course = {
      id = nextCourseId;
      title;
      sumRating = 0;
      countRating = 0;
      userReview = Map.new();
    };
    Map.set(courses, nhash, nextCourseId, newCourse);
    nextCourseId += 1;
  };

  public query func getAllCourse() : async [CourseSummary] {
    return Iter.toArray(Map.vals(courses));
  };

  public query func getCourseDetail(courseId : Nat) : async CourseDetail {
    switch (Map.get(courses, nhash, courseId)) {
      case (?c) {
        return {
          id = c.id;
          title = c.title;
          sumRating = c.sumRating;
          countRating = c.countRating;
          userReview = Iter.toArray(Map.vals(c.userReview));
        };
      };
      case null { Debug.trap("course not found") };
    };
  };

  public shared ({ caller }) func rateCourse(courseId : Nat, rate : Nat, content : Text) : async () {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    assert (rate >= 1 and rate <= 5);

    switch (Map.get(courses, nhash, courseId)) {
      case (?course) {
        switch (Map.get(course.userReview, phash, caller)) {
          case null {
            let newReview : Review = {
              reviewer = caller;
              rate;
              content;
              created = Time.now();
            };
            ignore Map.put(course.userReview, phash, caller, newReview);

            ignore Map.put(
              courses,
              nhash,
              courseId,
              {
                course with sumRating = course.sumRating + rate;
                countRating = course.countRating + 1;
              },
            );
          };
          case (?_) {
            Debug.trap("user already review this course");
          };
        };
      };
      case null { Debug.trap("course not found") };
    };
  };
};
