"use client";
import styles from "./page.module.css";
import React from "react";
import { reducer } from "./reducer";

interface TextFieldProp {
  course?: string | undefined;
  description?: string | undefined;
}

export interface CourseProps {
  id: number;
  title: string | undefined;
  description: string | undefined;
  isEnrolled: boolean;
}
export default function Home() {
  const [textFields, settextFields] = React.useState<TextFieldProp>();
  const [stateData, dispatch] = React.useReducer(reducer, []);
  const [isLoading, setIsloading] = React.useState(false)

  React.useEffect(() => {
    setIsloading(true)
    const fetchData = async () => {
      console.log("fetching data")
      setIsloading(true)
      const result = await fetch(
        "https://cartedo-mock-api-d9672364e747.herokuapp.com/api/courses"
      );
      const data: CourseProps[] = await result.json();
      dispatch({
        type: "COMPLETE",
        data,
      });
    };
    fetchData();
    setIsloading(false)
  }, []);

  const handleClick = (id: number) => {
    let upDatedData = [...stateData as CourseProps[]];
    upDatedData.forEach((course) => {
      if (course.id === id) {
        course["isEnrolled"] = course["isEnrolled"] ? false : true;
      }
    });

    dispatch({
      type: "HANDLE_ENROLL",
      id,
    });
  };

  const EnrollButton = ({
    courseId,
    isEnrolled,
  }: {
    courseId: number;
    isEnrolled: boolean;
  }) => {
    return (
      <div>
        <button
          onClick={() => handleClick(courseId)}
          className="border-2 rounded-sm p-1 text-xs"
        >
          {isEnrolled ? "UnEnroll" : "Enroll"}
        </button>
      </div>
    );
  };

  const handleAddCourse = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    let courseData = {
      id: Math.random() + 1,
      title: textFields?.course,
      description: textFields?.description,
      isEnrolled: false,
    };
    dispatch({
      type: "ADDCOURSE",
      courseData,
    });
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    settextFields({ ...textFields, [event.target.name]: event.target.value });
  };

  console.log("loading", isLoading)

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl">List of courses</h1>
      {isLoading ? <div>Loading Courses</div> : stateData?.map((course: CourseProps) => {
        return (
          <div key={course.id} className="flex p-2 border-1 my-2">
            <div className=" min-w-100">
              <h3 className="text-base">{course.title}</h3>
              <h5 className="text-sm">{course.description}</h5>

              <EnrollButton
                courseId={course.id}
                isEnrolled={course.isEnrolled}
              />
            </div>
            <div className="justify-items-end min-w-15">
              <p className="text-xs self-end">
                {course.isEnrolled && "Enrolled"}
              </p>
            </div>
            <hr className="my-2 self-end" />
          </div>
        );
      })}

      <div className="border-1 p-2">
        <div className="text my-2 underline">Add a New Course</div>
        <form onSubmit={handleAddCourse}>
          <label htmlFor="course">Course: </label>
          <input
            type="text"
            name="course"
            id="course"
            onChange={(event) => handleTextChange(event)}
            className="border-2 p-1 rounded-sm"
          />
          <br />
          <label htmlFor="description">Description </label>
          <input
            type="text"
            name="description"
            id="description"
            onChange={(event) => handleTextChange(event)}
            className="border-2 my-2 p-1 rounded-sm"
          />
          <br />

          <button type="submit" className="border-2 rounded-sm p-1">
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}
