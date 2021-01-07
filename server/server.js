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
const { throws } = require('assert');
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


// add user route
app.get('/user/add',(req, res) => {
    res.render('add_user', {
        title: "Adding users"
    });
    console.log("add block working")
});


//getting users by id
app.get('/user/:id', (req, res)=> {
    let id = req.params.id; 
    let qry = "SELECT * FROM users WHERE  id = ?";
    conn.query(qry, id, (err, rows, fields) => {
      if (!err){
        res.send(rows);
        console.log(rows);
      }
    });
});

//inserting data into db
app.post('/user/save', (req, res) => {
    let reqBody = req.body;
    let data = { name: reqBody.name, description: reqBody.description, email: reqBody.email, contact_no: reqBody.contact_no }
    let qry = "INSERT INTO users SET ?";
    conn.query(qry, data, (err, rows, fields) => {
       if(err) throw err;
       res.redirect('/');
    });
});

//deleting data using id
app.delete('/user/:id', (req, res) => {
    let id = req.params.id; 
    console.log(id)
    let qry = `DELETE FROM users where id = ${id}`;
    conn.query(qry, id, (err, rows, fields) => {
        if(err) throw err;
        res.redirect('/');
    })
});

//updating data using id
app.put('/update/:id', (req, res) => {
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
