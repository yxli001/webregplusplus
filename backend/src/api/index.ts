import "tsconfig-paths/register";
import serverless from "serverless-http";
import app from "@/app";

export default serverless(app);
