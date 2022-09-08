//jshint esversion:6
const { app } = require("./server");
app.listen(process.env.PORT|| process.env.DEV_PORT);