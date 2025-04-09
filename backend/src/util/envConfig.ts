import { config } from "dotenv";
import path from "path";

type EnvTypes = "development" | "staging" | "production";

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const envType = process.env.NODE_ENV as EnvTypes;

export { envType };
