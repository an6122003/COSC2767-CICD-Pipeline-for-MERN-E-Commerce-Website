// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import required modules
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const helmet = require("helmet");
const promBundle = require("express-prom-bundle");

// Import custom modules
const keys = require("./config/keys");
const routes = require("./routes");
const socket = require("./socket");
const setupDB = require("./utils/db");

// Destructure port from keys configuration
const { port } = keys;

// Initialize the Express application
const app = express();

// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to enhance security by setting various HTTP headers
app.use(
	helmet({
		contentSecurityPolicy: false, // Disable CSP for compatibility reasons
		frameguard: true, // Enable frameguard to prevent clickjacking
	}),
);

// Middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Middleware to enable prometheus scraping
const metricsMiddleware = promBundle({
	includeMethod: true,
	includePath: true,
	includeStatusCode: true,
	includeUp: true,
	customLabels: {
		project_name: "Rmit-store",
		project_type: "Rmit-server-metrics",
	},
	promClient: {
		collectDefaultMetrics: {},
	},
});
// add the prometheus middleware to all routes
app.use(metricsMiddleware);

// Setup the database connection
setupDB();

// Configure Passport.js for authentication
require("./config/passport")(app);

// Use the defined routes for handling requests
app.use(routes);

// Start the server and listen on the specified port
const server = app.listen(port, "0.0.0.0", () => {
	console.log(
		`${chalk.green("✓")} ${chalk.blue(
			`Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`,
		)}`,
	);
});

app.get("/healthcheck", (req, res) => {
	res.status(200).send("OK");
});


// Initialize WebSocket server
socket(server);

// Export app and server for testing
module.exports = { app, server };

