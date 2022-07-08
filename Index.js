// // https://www.youtube.com/watch?v=re3OIOr9dJI&t=3847s
// //https://www.youtube.com/watch?v=AohARsUlwQk&t=1062s  --del/up
//https://www.youtube.com/watch?v=0W6i5LYKCSI&t=2125s 31
//https://www.youtube.com/watch?v=W-sZo6Gtx_E&t=679s 14
//https://www.youtube.com/watch?v=xgsn6Z60XAM get request
const mysql = require("mysql")
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors());
app.use(express.json())

// mysql://b8008c6e1c1f64:9ae9d678@us-cdbr-east-06.cleardb.net/heroku_ac3f8ac31cd9322?reconnect=true

const db = mysql.createConnection({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b8008c6e1c1f64',
    password: '9ae9d678',
    database: 'heroku_ac3f8ac31cd9322',
    port: 3306
})


app.put('/updateUserDetails', (req, res) => {
    const userEmail = req.body.userEmail;
    const password = req.body.password;
    const farstName = req.body.farstName;
    const lastName = req.body.lastName;
    const initials = req.body.initials;
    const useLevel = req.body.useLevel;
    const IsActive = req.body.IsActive;
    const LNG= req.body.LNG;
    const isInTheSystem = req.body.isInTheSystem;
    const DateTime = req.body.DateTime;
    const userCreate = req.body.userCreate;
    const userId = req.body.userId;
    db.query("update machines.users set userEmail=?, password=?,farstName=?,lastName=?,initials=?,useLevel=?,IsActive=?,LNG=? ,isInTheSystem=? \
    ,DateTime=?,userCreate=?  where userId=?"
        , [userEmail, password, farstName, lastName, initials, useLevel, IsActive,LNG, isInTheSystem, DateTime, userCreate, userId], //have to save the order of the field
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
})

app.put('/updateIsLogIn', (req, res) => {
    const lastLogIn = req.body.lastLogIn;
    const userid = req.body.userid;
    db.query("update machines.users set  isInTheSystem=1, lastLogIn=? where userid=? and IsActive=1"
        , [lastLogIn, userid], //have to save the order of the field
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
})

app.put('/updateIsLogOut', (req, res) => {
    const userid = req.body.userid;
    db.query("update machines.users set  isInTheSystem=0  where userid=? and IsActive=1"
        , [userid], //have to save the order of the field
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
})

app.get('/getAllUsers', (req, res) => {
    db.query("select * from machines.users order by farstName"
        , (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.send(result)
            }
        })
})

app.post('/loginAuthentication', (req, res) => {
    const password = req.body.password;
    const userEmail = req.body.userEmail;
    db.query("select * from machines.users where password=? and userEmail=? and IsActive=true and isInTheSystem=false ", [password, userEmail], (err, result) => {
        if (err) {
            res.send({ err: err });
        }
        if (result.length > 0) {
            res.send(result);
        } else {
            res.send({ message: "wrong userMaile/password combination OR user NOT Active!! Or you are all radey in the system" });
        }
    })
})

app.post('/managerApproveAuthentication', (req, res) => {
    const password = req.body.password;
    const userEmail = req.body.userEmail;
    db.query("select * from machines.users where password=? and userEmail=? and IsActive=true ", [password, userEmail], (err, result) => {
        if (err) {
            res.send({ err: err });
        }
        if (result.length > 0) {
            res.send(result);
        } else {
            res.send({ message: "wrong userMaile/password combination " });
        }
    })
})

app.post('/AuthenticationIfEmailAlreadyExist', (req, res) => {
    const userEmail = req.body.userEmail;
    db.query("select * from machines.users where userEmail=? ", [userEmail], (err, result) => {
        if (err) {
            res.send({ err: err });
        }
        if (result.length > 0) {
            res.send({ message: "Email Already Exist" });
            // res.send(result);
        } else {
            res.send(result);
        }
    })
})

app.post('/AuthenticationIfEditeEmailAlreadyExist', (req, res) => {
    const userEmail = req.body.userEmail;
    db.query("select count(*)  + ifnull(userID,0) as userID  from machines.users where userEmail=?", [userEmail], (err, result) => {
        if (err) {
            res.send({ err: err });
        }
        if (result.length > 0) {
            res.send(result);
        } else {
            res.send(result);
        }
    })
})

app.delete('/deleteUser/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query("DELETE FROM machines.users where userId=?", userId, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/addNewUser', (req, res) => {
    const userEmail = req.body.userEmail;
    const password = req.body.password;
    const initials = req.body.initials;
    const farstName = req.body.farstName;
    const lastName = req.body.lastName;
    const useLevel = req.body.useLevel;
    const LNG= req.body.LNG;
    const DateTime = req.body.DateTime;
    const userCreate = req.body.userCreate;
    db.query("INSERT INTO machines.users (userEmail,password,initials,farstName,lastName,useLevel,LNG,DateTime,userCreate) VALUES (?,?,?,?,?,?,?,?,?)",
        [userEmail, password, initials, farstName, lastName, useLevel,LNG, DateTime, userCreate], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("values Inserted");
            }
        });
});

// *********************TAGS*******************************
app.put('/updateTagsOnOff101', (req, res) => {
    const TagValue = req.body.TagValue;
    
    db.query("update r_mes.machine_tags set  TagValue=? ,LastTimeUpdateTage=NOW()  where machineID=1 and TagDesID=1"
        , [ TagValue],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
})

app.put('/updateMachineTagScrapQTY', (req, res) => {
    const TagValue = 0;
    const LastTimeUpdateTage=req.body.LastTimeUpdateTage;
    const machineID = req.body.machineID;
    const TagDesID = 3;
   
    db.query("update r_mes.machine_tags set  TagValue=? ,LastTimeUpdateTage=?  where machineID=? and TagDesID=?"
        , [ TagValue,LastTimeUpdateTage, machineID,TagDesID],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
})

app.put('/updateTags', (req, res) => {
    const TagValueBefore = req.body.TagValueBefore;
    const LastTimeUpdateTage= req.body.LastTimeUpdateTage;
    const TagID = req.body.TagID;

    db.query("update r_mes.machine_tags  set   TagValueBefore=?,LastTimeUpdateTage=? where TagID=?"
        , [TagValueBefore,LastTimeUpdateTage, TagID],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`runing on port 3001 ${PORT}`);
})








