const {exec} = require("child_process");
const functions = require("firebase-functions");
const path = require("path");

// Path to your Spring Boot JAR file
const springBootApp = path.join(
    __dirname,
    "path/to/your/spring-boot-application.jar",
);

exports.springBootFunction = functions.https.onRequest((req, res) => {
  exec(`java -jar ${springBootApp}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(error);
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send(stdout);
  });
});
