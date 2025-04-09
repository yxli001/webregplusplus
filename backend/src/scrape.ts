import puppeteer, { Browser } from "puppeteer";
import { serverLogger } from "@/util/logger";
import {
  Course,
  MainSection,
  SubSection,
  MainSectionType,
  SubSectionType,
  ExamType,
} from "@/types";

export async function scrapeSchedule(): Promise<Course[]> {
  const SCHEDULE_OF_CLASSES_URL =
    "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm";

  const SCHEDULE_OF_CLASSES_RESULT_URL =
    "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm";

  // Number of pages to scrape at the same time
  const BATCH_SIZE = 30;

  let browser: Browser | null = null;

  try {
    serverLogger.info("Starting Puppeteer browser...");
    browser = await puppeteer.launch({ headless: true, browser: "chrome" }); // Set to false if debugging

    const page = await browser.newPage();

    serverLogger.info("Navigating to the webpage...");
    await page.goto(SCHEDULE_OF_CLASSES_URL, { waitUntil: "domcontentloaded" });

    serverLogger.info("Waiting for quarter selector to load...");
    await page.waitForSelector("#selectedTerm");

    serverLogger.info("Selecting Spring 2025 quarter...");
    await page.select("#selectedTerm", "SP25");

    await page.waitForNetworkIdle();

    serverLogger.info("Waiting for subject list to load...");
    await page.waitForSelector("select#selectedSubjects option");

    serverLogger.info("Selecting all subjects...");
    await page.evaluate(() => {
      const subjectOptions = document.querySelectorAll(
        "select#selectedSubjects option",
      );

      subjectOptions.forEach((option) => {
        (option as HTMLOptionElement).selected = true;
      });
    });

    serverLogger.info("Waiting for checkboxes to load...");
    await page.waitForSelector("input[id^=schedOption]");

    serverLogger.info("Checking all options...");
    await page.evaluate(() => {
      const checkboxes = document.querySelectorAll("input[id^='schedOption']");
      checkboxes.forEach((checkbox) => {
        (checkbox as HTMLInputElement).checked = true;
      });
    });

    serverLogger.info("Searching...");
    await page.click("#socFacSubmit");

    serverLogger.info("Waiting for page numbers...");
    await page.waitForSelector("tr > td[align='right']");

    const numPages = await page.evaluate(() => {
      const pageNumbers = document.querySelector("tr > td[align='right']");

      if (!pageNumbers) {
        return 1;
      }

      return parseInt(
        pageNumbers.textContent
          ?.substring(
            pageNumbers.textContent.indexOf("of") + 3,
            pageNumbers.textContent.indexOf(")"),
          )
          .trim() || "1",
      );
    });
    serverLogger.info(`Total pages: ${numPages}`);

    const courses: Course[] = [];

    for (let batchStart = 0; batchStart < numPages; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, numPages);

      serverLogger.info(`Processing pages ${batchStart + 1} to ${batchEnd}`);

      const pages = await Promise.all(
        Array.from({ length: batchEnd - batchStart }, async (_, i) => {
          const newPage = await browser!.newPage();
          await newPage.goto(
            `${SCHEDULE_OF_CLASSES_RESULT_URL}?page=${batchStart + i + 1}`,
            {
              waitUntil: "domcontentloaded",
            },
          );
          return newPage;
        }),
      );

      const pageCoursesArray = await Promise.all(
        pages.map((page) =>
          page.evaluate(
            (MainSectionType, SubSectionType) => {
              const acceptableSections = ["SE", "LE", "LA", "DI", "ST"];

              const scrapedCourses: Course[] = [];

              const table = document.querySelector(".tbrdr");

              if (!table) {
                throw new Error("No table found.");
              }

              const rows = Array.from(table.querySelectorAll("tr"));

              let course: Course = {
                subject: "",
                code: "",
                name: "",
                mainSections: [],
              };

              // Loop through all the rows in the table
              for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const cells = Array.from(row.querySelectorAll("td"));

                // Title cell
                if (cells.length == 1) {
                  // No subject acronym
                  if (cells[0].querySelectorAll("span").length == 1) continue;

                  // Push the previous course if it exists
                  if (course.code !== "") {
                    scrapedCourses.push(course);
                  }

                  // Subject acronym
                  const span = cells[0].querySelector("h2 span");

                  if (!span) continue;

                  course = {
                    subject: span.innerHTML
                      .substring(
                        span.innerHTML.indexOf("(") + 1,
                        span.innerHTML.indexOf(")"),
                      )
                      .trim(),
                    code: "",
                    name: "",
                    mainSections: [],
                  };
                }

                // Course header cell
                if (cells.length == 4) {
                  const courseCode = (cells[1].textContent || "").trim();
                  const courseName = cells[2]
                    .querySelector("a > span.boldtxt")
                    ?.textContent?.trim();

                  // Push the previous course if we are looking at a new course
                  if (course.code !== "" && course.code !== courseCode) {
                    scrapedCourses.push(course);

                    course = {
                      subject: course.subject,
                      code: course.code,
                      name: course.name,
                      mainSections: [],
                    };
                  }

                  course.code = courseCode || "";
                  course.name = courseName || "";
                }

                // Section (could be 10 cells, but everything would be TBA)
                if (row.className === "sectxt" && cells.length == 13) {
                  const sectionId = (cells[2].textContent || "").trim();
                  const sectionType = (cells[3].textContent || "").trim();
                  const sectionCode = (cells[4].textContent || "").trim();
                  const days = (cells[5].textContent || "").trim();
                  const time = (cells[6].textContent || "").trim();
                  const instructor = (
                    (cells[9].querySelector("a")
                      ? cells[9].querySelector("a")!.textContent
                      : cells[9].textContent) || ""
                  ).trim();

                  const location = `${(cells[7].textContent || "").trim()} ${(cells[8].textContent || "").trim()}`;

                  // Not a section type we care about
                  if (!acceptableSections.includes(sectionType)) continue;

                  // Time TBA
                  if (time === "TBA") continue;

                  // Main section
                  if (
                    sectionType === MainSectionType.SE ||
                    (Object.values(MainSectionType).includes(
                      sectionType as MainSectionType,
                    ) &&
                      sectionCode.substring(1) === "00")
                  ) {
                    const [startTime, endTime] = time.split("-");
                    const mainSection: MainSection = {
                      type: sectionType as MainSectionType,
                      letter: sectionCode.substring(0, 1),
                      sections: [],
                      exams: [],
                      instructor,
                      location,
                      days,
                      startTime,
                      endTime,
                    };
                    course.mainSections.push(mainSection);
                  } // Subsection
                  else if (
                    Object.values(SubSectionType).includes(
                      sectionType as SubSectionType,
                    )
                  ) {
                    const [startTime, endTime] = time.split("-");
                    const subSection: SubSection = {
                      type: sectionType as SubSectionType,
                      section: sectionCode.substring(1),
                      isRequired: sectionId === "",
                      location,
                      startTime,
                      endTime,
                      days,
                    };

                    if (course.mainSections.length !== 0) {
                      const mainSection =
                        course.mainSections[course.mainSections.length - 1];

                      mainSection.sections.push(subSection);
                    }
                  }
                }

                // Exam
                if (row.className === "nonenrtxt" && cells.length == 10) {
                  const examType = cells[2].textContent?.trim() || "";
                  const examDate = cells[3].textContent?.trim() || "";
                  const examTime = cells[5].textContent?.trim() || "";
                  const examLocation = `${cells[6].textContent?.trim() || ""} ${cells[7].textContent?.trim() || ""}`;

                  const [startTime, endTime] = examTime.split("-");
                  const exam = {
                    type: examType as ExamType,
                    date: new Date(examDate),
                    startTime,
                    endTime,
                    location: examLocation,
                  };

                  if (course.mainSections.length !== 0) {
                    const mainSection =
                      course.mainSections[course.mainSections.length - 1];

                    mainSection.exams.push(exam);
                  }
                }
              }

              // Push the last course
              if (course.code !== "") {
                scrapedCourses.push(course);
              }

              return scrapedCourses;
            },
            MainSectionType,
            SubSectionType,
          ),
        ),
      );

      pageCoursesArray.forEach((pageCourses) => {
        if (!pageCourses || pageCourses.length === 0) {
          serverLogger.info("No courses found.");
          return;
        }

        // Check if there are overlapping courses and merge them
        if (
          courses.length > 0 &&
          pageCourses[0].name === courses[courses.length - 1].name &&
          pageCourses[0].code === courses[courses.length - 1].code
        ) {
          courses[courses.length - 1].mainSections.push(
            ...pageCourses[0].mainSections,
          );
          pageCourses.shift();
        }

        courses.push(...pageCourses);
      });

      // Close the pages after processing
      await Promise.all(pages.map((page) => page.close()));
    }

    if (!courses) {
      serverLogger.error("No courses found.");
      return [];
    }

    serverLogger.debug(`Found ${courses.length} courses.\n`);

    return courses;
  } catch (error) {
    serverLogger.error(`Scraping failed: ${(error as Error).stack}`);

    return [];
  } finally {
    if (browser) {
      await browser.close();
      serverLogger.info("Closed Puppeteer browser.");
    }
  }
}
