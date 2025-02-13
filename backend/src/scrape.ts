import logger from "./logger";

export default async function scrape() {
  return new Promise((resolve) => {
    setTimeout(() => {
      logger.debug("Task completed!");
      resolve(null);
    }, 2000);
  });
}
