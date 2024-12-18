import {registerAs} from "@nestjs/config";

export default registerAs("app", () => ({
    environments: process.env.NODE_ENV || "production",
}));
