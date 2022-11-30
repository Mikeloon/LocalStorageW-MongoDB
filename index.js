const express = require("express");
const app = express();
const fs = require("fs");
const {json} = require("express");
const bodyParser = require("body-parser");
const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1:27017/tareas',['tareas'])
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());


app.listen(27017, () => console.log(`Example app listening on port 27017!`))

app.post("/",(req,res) =>{
    console.log(req.body)
    let lista = req.body;
    lista.forEach(elem =>{
        db.tareas.insert(elem,(err,result) =>{
            if (err){
                res.send(err);
            }
        })
    })
    res.send("Tareas subidas correctamente");
})

let fileContent = function (){
    return new Promise((resolve, reject) => {
        fs.readFile("./data.txt",(err, data)=>{
            if (err) reject(err);
            else resolve(data);
        })
    })
}
app.get("/api/download",(req,res) =>{
    db.tareas.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            docs.forEach(e =>{
                db.tareas.remove({_id : mongojs.ObjectId(e._id)},function (err){if (err)console.log(err)})
            })
            res.send(docs);

        }
    })
});