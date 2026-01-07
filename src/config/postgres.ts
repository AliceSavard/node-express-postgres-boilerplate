import { Client } from "pg";
import config from "./config.js";
import logger from "./logger.js";

let postgres: Client;

(async function name() {
	postgres = new Client(config.sqlDB);
	try {
		await postgres.connect();
		logger.info("Connect to postgress sucessfully");
		return postgres;
	} catch (error) {
		logger.error("Connect to postgress error");
		process.exit(1);
	}
})();

export { postgres };
