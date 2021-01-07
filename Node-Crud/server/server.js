//use path module
const path = require('path');
// set ejs as engine
const ejs = require('ejs');
//use express module
const express = require('express');
//use body parser module
const bodyParser = require('body-parser');
//use my sql module
const mysql = require('mysql');
// const { createConnection } = require('net');

//create an express seerver
const app = express();
//create/ define port number
const port = process.env.PORT || 4000;

//set the views 
app.set('views',path.join(__dirname, '../views'));
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//set assests folder as static folder for static file
app.use(express.static("public"));

//create connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_crud',
    multipleStatements: true
});

//connect to database
conn.connect((err) => {
    if(err) throw err;
    console.log('My sql database connected successfully');
});

//route for get all data
app.get('/',(req, res) => {
    let qry = "SELECT * FROM users";
        conn.query(qry, (err, rows, fields) => {
          if (!err){
            // res.send(rows);
            //render to home Page
            res.render('homePage', {
                rows:rows
            });
            console.log(rows);
          }
        });
});

//getting users by id
app.get('/:id', (req, res)=> {
    let id = req.params.id; 
    let qry = "SELECT * FROM users WHERE  id = ?";
    conn.query(qry, id, (err, rows, fields) => {
      if (!err){
        res.send(rows);
        console.log(rows);
      }
    });
});

// add user route
app.get('/add',(req, res) => {
    res.render('add_user', {
        title: "Adding users"
    });
    });

//inserting data into db
app.post('', (req, res) => {
    let reqBody = req.body;
    let data = { name: reqBody.name, description: reqBody.description, email: reqBody.email, contact_no: reqBody.contact_no }
    let qry = "INSERT INTO users SET ?";
    conn.query(qry, data, (err, rows, fields) => {
        if(!err){
            res.send(data);
            console.log("rows have been added")
        }
    })
});

//deleting data using id
app.delete('/:id', (req, res) => {
    let id = req.params.id; 
    let qry = "DELETE FROM users WHERE id = ?";
    conn.query(qry, id, (err, rows, fields) => {
        if(!err){
            res.send(`row has been deleted with id:  ${id}`);
            console.log("rows have been deleted")
        }
    })
});

//updating data using id
app.put('/:id', (req, res) => {
    let qry = 'UPDATE users SET ? WHERE ?'
    conn.query(qry, [req.body, req.params], (err, rows, fields) => {
        if(!err){
            res.send(rows);
            console.log(rows)
        }
    })
});

//start server at port 4000
app.listen(port, ()=>{
    console.log(`Server running at port ${port}`)
})
