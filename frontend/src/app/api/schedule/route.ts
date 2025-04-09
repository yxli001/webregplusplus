import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { dummyCourses } from "@/app/lib/dummy_courses"; // JSON file

export async function GET() {
  const parsedLectures = dummyCourses.lectures.map((lecture: Lecture) => ({
    ...lecture,
    start_time: DateTime.fromFormat(lecture.start_time, "HH:mm").toISO(),
    end_time: DateTime.fromFormat(lecture.end_time, "HH:mm").toISO(),
  }));

  return NextResponse.json(parsedLectures);
}
