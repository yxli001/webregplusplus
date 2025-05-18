import "module-alias/register";

import serverless from "serverless-http";
import app from "@/app";

export default serverless(app);
