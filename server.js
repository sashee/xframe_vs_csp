const express = require('express')
const fs = require("fs");


const configureApp = (app, port) => {
	app.get("/", (req, res) => {
		fs.readFile("topsite.html", "utf-8", (err, contents) => {
			if (err) {
				res.sendStatus(500);
			}else {
				res.send(contents.replace("$PORT", port));
			}
		});
	});

	app.get("/page", (req, res) => {
		if (req.query.xframe !== undefined) {
			res.setHeader("X-Frame-Options", "sameorigin");
		}
		if (req.query.csp_all !== undefined) {
			res.setHeader("Content-Security-Policy", "frame-ancestors localhost:3000 localhost:3001;");
		}
		if (req.query.csp_3000 !== undefined) {
			res.setHeader("Content-Security-Policy", "frame-ancestors localhost:3000;");
		}
		if (req.query.csp_3001 !== undefined) {
			res.setHeader("Content-Security-Policy", "frame-ancestors localhost:3001;");
		}

		res.send("OK");
	})
	app.get("/include", (req, res) => {
		fs.readFile("firstlevel.html", "utf-8", (err, contents) => {
			if (err) {
				res.sendStatus(500);
			}else {
				const query = Object.entries(req.query).filter(([key]) => key !== "port").reduce((acc, [key, val]) => `${acc}${key}=${val}&`, "").slice(0, -1);

				res.send(contents.replace("$PORT", req.query.port).replace("$QUERY", query));
			}
		});
	})

	app.listen(port);
}
{
	const app = express()

	configureApp(app, 3000);
}

{
	const app = express()

	configureApp(app, 3001);
}