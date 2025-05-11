import puppeteer, { Browser } from "puppeteer";
import { serverLogger } from "@/util/logger";
import {
  Course,
  MainSection,
  SubSection,
  MainSectionType,
  SubSectionType,
  ExamType,
  Quarter,
} from "@/types";

export async function scrapeSchedule(): Promise<Quarter[]> {
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

    serverLogger.info("Extracting available terms...");
    const quarters = await page.evaluate(() => {
      const options = Array.from(
        document.querySelectorAll("#selectedTerm option"),
      ) as HTMLOptionElement[];

      const acceptableTermsRegex = /^(FA|WI|SP)\d{2}$/;

      return options
        .filter((option) => acceptableTermsRegex.test(option.value.trim()))
        .map((option) => option.value.trim());
    });

    serverLogger.info(`Found quarters: ${quarters.join(", ")}\n`);

    const quartersCourses: Quarter[] = [];
    for (const quarter of quarters) {
      const currQuarter: Quarter = {
        name: quarter,
        courses: [],
      };

      serverLogger.info(`Scraping term: ${quarter}`);

      await page.select("#selectedTerm", quarter);

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
        const checkboxes = document.querySelectorAll(
          "input[id^='schedOption']",
        );
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

      for (
        let batchStart = 0;
        batchStart < numPages;
        batchStart += BATCH_SIZE
      ) {
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
                const unacceptableSections = ["IT"];

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

                  // Section
                  if (row.className === "sectxt" && cells.length >= 10) {
                    const sectionId = (cells[2].textContent || "").trim();
                    const sectionType = (cells[3].textContent || "").trim();
                    const sectionCode = (cells[4].textContent || "").trim();
                    let days, startTime, endTime, instructor, location;

                    // Not a section type we care about
                    if (unacceptableSections.includes(sectionType)) continue;

                    // Times are TBA
                    if (cells.length == 10) {
                      days = "TBA";
                      startTime = "TBA";
                      endTime = "TBA";
                      location = "TBA";
                      instructor = (
                        (cells[6].querySelector("a")
                          ? cells[6].querySelector("a")!.textContent
                          : cells[6].textContent) || ""
                      ).trim();
                    }
                    // Times are not TBA
                    else {
                      const time = (cells[6].textContent || "").trim();

                      startTime = time.split("-")[0].trim();
                      endTime = time.split("-")[1].trim();
                      days = (cells[5].textContent || "").trim();
                      instructor = (
                        (cells[9].querySelector("a")
                          ? cells[9].querySelector("a")!.textContent
                          : cells[9].textContent) || ""
                      ).trim();
                      location = `${(cells[7].textContent || "").trim()} ${(cells[8].textContent || "").trim()}`;
                    }

                    // Main section
                    if (
                      Object.values(MainSectionType).includes(
                        sectionType as MainSectionType,
                      ) &&
                      sectionCode.substring(1) === "00"
                    ) {
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
                    }
                    // Subsection
                    else if (
                      Object.values(SubSectionType).includes(
                        sectionType as SubSectionType,
                      )
                    ) {
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
                      date: examDate,
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

        currQuarter.courses.push(...pageCoursesArray.flat());

        // Close the pages after processing
        await Promise.all(pages.map((page) => page.close()));
      }

      // Remove duplicate courses
      currQuarter.courses = currQuarter.courses.reduce(
        (acc: Course[], course: Course) => {
          const existingCourse = acc.find(
            (c) => c.code === course.code && c.subject === course.subject,
          );

          if (!existingCourse) {
            acc.push(course);
          } else {
            // Merge main sections
            existingCourse.mainSections = existingCourse.mainSections.concat(
              course.mainSections,
            );
          }

          return acc;
        },
        [],
      );

      serverLogger.info(
        `Found ${currQuarter.courses.length} courses for ${currQuarter.name}\n`,
      );

      serverLogger.info("Navigating back to the search page...");
      await page.goto(SCHEDULE_OF_CLASSES_URL, {
        waitUntil: "domcontentloaded",
      });

      serverLogger.info("Waiting for quarter selector to load...\n");
      await page.waitForSelector("#selectedTerm");

      quartersCourses.push(currQuarter);
    }

    return quartersCourses;
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
