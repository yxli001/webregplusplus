import { scrapeSchedule } from "../util/scraper";
import SubSection from "../models/SubSection.model";
import Exam from "../models/Exam.model";
import MainSection from "../models/MainSection.model";
import Course from "../models/Course.model";
import QuarterModel from "../models/Quarter.model";
import { serverLogger } from "../util/logger";
import { Sequelize } from "sequelize";
import { Quarter } from "../types";

const RETRY_DELAY = 1000 * 60 * 2; // 2 minutes

const updateSchedules = async (sequelize: Sequelize, retryOnFail: boolean) => {
  try {
    serverLogger.info("Verifying database connection...");

    await sequelize.authenticate();

    serverLogger.info("Updating schedules...");

    const quarters = await scrapeSchedule();

    if (quarters.length === 0) {
      throw new Error("Scraping schedule data failed");
    }

    serverLogger.info(
      "Scraped schedule data:" + JSON.stringify(quarters.map((q) => q.name)),
    );

    await saveQuarters(sequelize, quarters);
  } catch (error) {
    serverLogger.error("Error updating schedules:" + (error as Error).stack);

    if (retryOnFail) {
      serverLogger.info(`Retrying in ${RETRY_DELAY / 1000}s…`);
      setTimeout(() => {
        void updateSchedules(sequelize, true);
      }, RETRY_DELAY);
    } else {
      throw error;
    }
  }
};

const saveQuarters = async (sequelize: Sequelize, quarters: Quarter[]) => {
  // Start transaction to replace all data
  const t = await sequelize.transaction();

  try {
    await Promise.all([
      SubSection.destroy({
        where: {},
        cascade: true,
        transaction: t,
      }),
      Exam.destroy({
        where: {},
        cascade: true,
        transaction: t,
      }),
      MainSection.destroy({
        where: {},
        cascade: true,
        transaction: t,
      }),
      Course.destroy({
        where: {},
        cascade: true,
        transaction: t,
      }),
      QuarterModel.destroy({
        where: {},
        cascade: true,
        transaction: t,
      }),
    ]);

    for (const quarter of quarters) {
      serverLogger.info(`Saving quarter: ${quarter.name}`);

      const newQuarter = await QuarterModel.create(
        {
          name: quarter.name,
        },
        {
          transaction: t,
        },
      );

      for (const course of quarter.courses) {
        const newCourse = await Course.create(
          {
            code: course.code,
            subject: course.subject,
            quarterId: newQuarter.id,
          },
          {
            transaction: t,
          },
        );

        for (const main of course.mainSections) {
          const newMain = await MainSection.create(
            {
              letter: main.letter,
              days: main.days,
              startTime: main.startTime,
              endTime: main.endTime,
              instructor: main.instructor,
              location: main.location,
              type: main.type,
              courseId: newCourse.id,
            },
            {
              transaction: t,
            },
          );

          for (const sub of main.sections) {
            await SubSection.create(
              {
                days: sub.days,
                startTime: sub.startTime,
                endTime: sub.endTime,
                isRequired: sub.isRequired,
                location: sub.location,
                section: sub.section,
                type: sub.type,
                mainSectionId: newMain.id,
              },
              {
                transaction: t,
              },
            );
          }

          for (const exam of main.exams) {
            await Exam.create(
              {
                date: exam.date,
                endTime: exam.endTime,
                location: exam.location,
                startTime: exam.startTime,
                type: exam.type,
                mainSectionId: newMain.id,
              },
              {
                transaction: t,
              },
            );
          }
        }
      }
      serverLogger.info(`Saved quarter: ${quarter.name}`);
    }

    serverLogger.info("Committing transaction...");

    await t.commit();

    serverLogger.info("Schedules updated successfully.");
  } catch (error) {
    await t.rollback();

    serverLogger.error(
      "Schedule update failed, rolled back:" + (error as Error).stack,
    );

    throw new Error("Database update failed");
  }
};

export { updateSchedules };
