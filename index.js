const robots = {
  input: require("./controllers/input.js"),
  text: require("./controllers/text.js")
};

async function start() {
  robots.input();
  await robots.text()
}

start();
