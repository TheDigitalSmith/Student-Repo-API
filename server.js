const express = require("express")
const server = express();
const studentService = require ("./src/services/students.js")


server.use(express.json())
server.use("/students", studentService)

server.listen(3030, ()=> {
    console.log("Server is active on 3030");
})