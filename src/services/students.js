const express = require("express");
const fs = require ("fs")
const path = require ("path")

const router = express.Router()

const studentsFilePath = path.join(__dirname,"students.json");

const readFile = () =>{
    const buffer = fs.readFileSync(studentsFilePath)
    const content = buffer.toString();
    return JSON.parse(content)
}

router.get("/", (req,res) => {
    res.send(readFile())
})

router.get("/:id", (req,res) => {
    let students = readFile();
    let student = students.find(student => student._id == req.params.id);
    
    if (student){ 
        res.send(student);
    }else{ 
        res.status(404).send("Student Not Found");
    }
})

router.post("/", (req,res)=>{
    let previousStudents = readFile();
    if (previousStudents.find(student => student.email == req.body.email)){
        res.status(500).send("Email already exists")
    }else{
    req.body._id = previousStudents.length + 1;
    req.body.creationTIme = new Date()
    
    previousStudents.push(req.body)
    fs.writeFileSync(studentsFilePath, JSON.stringify(previousStudents));
    res.send({_id: req.body._id})
    }
})

router.delete("/:id",(req,res) =>{
    let students = readFile();
    let remainedStudents = students.filter(student => student._id != req.params.id);

    if (remainedStudents.length < students.length){
    fs.writeFileSync(studentsFilePath, JSON.stringify(remainedStudents))
    res.send("Removed")
    }else{
        res.status(404).send("Not Found")
    }
})

router.put("/:id",(req,res)=>{
    let students = readFile()
    editStudent = students.find(student => student._id == req.params.id)
    if (editStudent){
        let mergedStudent  = Object.assign(editStudent,req.body)
        let positionOfEditedStudent = students.indexOf(editStudent)

        students[positionOfEditedStudent] = mergedStudent
        fs.writeFileSync(studentsFilePath, JSON.stringify(students))
        res.send(mergedStudent)
    }else{
        res.status(404).send("User not found")
    }
})

router.post("/checkEmail/:email",(req,res)=>{
    let students = readFile();
    res.send(
        students.find(student => student.email == req.params.email) ? "Email unavailable" : "Email available"
        )
})
module.exports = router;