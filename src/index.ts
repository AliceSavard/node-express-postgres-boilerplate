import http from "http";
import app from "./app";
import config from "./config/config";
import logger from "./config/logger";
import { postgres } from "./db/db";

// Test database connection
(async () => {
	try {
		await postgres.query("SELECT NOW()");
		logger.info("Database connected successfully");
	} catch (error) {
		logger.error("Failed to connect to database:", error);
		process.exit(1);
	}
})();

const server: http.Server = new http.Server(app);

const port: number = config.port || 3000;
server.listen(port, () => {
	logger.info(`App is listening on port ${config.port}`);
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: Error) => {
	logger.error(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	logger.info("SIGTERM received");
	if (server) {
		server.close();
	}
});
