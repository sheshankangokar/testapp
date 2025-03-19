import { CourseProps } from "./page";

export const reducer = (
  state: CourseProps[] | undefined,
  action: {
    type?: string | undefined;
    data?: CourseProps[];
    id?: number;
    courseData?: CourseProps;
  }
) => {
  switch (action.type) {
    case "COMPLETE":
      if (action.data) {
        return [
          ...action.data.map((course: CourseProps) => {
            return { ...course, ["isEnrolled"]: false };
          }),
        ];
      }

    case "ADDCOURSE":
      let updatedData = [...(state as CourseProps[])];
      if (action.courseData) {
        updatedData.push(action.courseData);
      }
      return updatedData;

    case "HANDLE_ENROLL":
      let upDatedEnrollData = [...(state as CourseProps[])];
      upDatedEnrollData.forEach((course) => {
        if (course.id === action.id) {
          course.isEnrolled = !course.isEnrolled;
        }
      });
      return upDatedEnrollData;
      
    default:
      return state;
  }
};
