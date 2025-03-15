import { getCourses } from "@/api/courses";
import CourseDropdown from "@/components/CourseDropdown";

export default async function Home() {
  const courses = await getCourses();

  if (!courses.success) return null;

  return <CourseDropdown courses={courses.data} />;
}
