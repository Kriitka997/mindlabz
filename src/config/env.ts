import dotEnv from "dotenv";
import appPath from "app-root-path";

dotEnv.config({ path: `${appPath}./env` });

export default {
    NODE_ENV: process.env.NODE_ENV,
    APP_ROOT: appPath.path,
    PORT: process.env.PORT,
}