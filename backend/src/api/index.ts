import { addAliases } from "module-alias";
import { join } from "path";

// manually add aliases for serverless function
addAliases({
  "@": join(__dirname, ".."),
});

import serverless from "serverless-http";
import app from "../app";

export default serverless(app);
