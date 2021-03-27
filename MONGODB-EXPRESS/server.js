// modules =================================================
const express = require("express");
const app = express();
var cors = require("cors");
var mongoose = require("mongoose");
//MongooseJs: Mongoose is basically a package that serves as a mediator between the
//NodeJS application and MongoDB server. It is an Object Document Mapper(ODM)
//that allows us to define objects with strongly-typed-schema that is mapped to a MongoDB document.
//Mongoose supports all the CRUD operations – Creating, Retrieving,
//Updating and Deleting.MongooseJs: Mongoose is basically a package that serves as
//a mediator between the NodeJS application and MongoDB server.
//It is an Object Document Mapper(ODM) that allows us to define objects with strongly-typed-schema
//that is mapped to a MongoDB document.

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// set our port
const port = 3000;

// configuration ===========================================
var db = require("./config/db");
console.log("connecting--", db);
mongoose.connect(db.url); //Mongoose connection created
const con = mongoose.connection;
con.on("open", () => {
  console.log("connected.......");
});

// frontend routes =========================================================
app.get("/", (req, res) => res.send("Welcome to this Index page "));

// grab the models we just created
var Student = require("./app/models/students");
var Teacher = require("./app/models/teachers");

// get all students
// get all teachers
app.get("/api/students", function (req, res) {
  Student.find(function (err, students) {
    if (err) res.send(err);
    res.json(students);
  });
});

//post con query
app.post("/api/students/send", function (req, res) {
  var newStudent = new Student();
  newStudent.id = req.query.studente_id;
  newStudent.name = req.query.name;
  newStudent.address = req.query.address;
  newStudent.city = req.query.city;
  newStudent.Postcode = req.query.Postcode;

  newStudent.save(function (err, data) {
    if (err) {
      console.log(error);
    } else {
      res.json("student inserted with success");
    }
  });
});

//post con body
app.post("/api/students/send1", function (req, res) {
  var newStudent = new Student();
  newStudent.id = req.body.studente_id;
  newStudent.name = req.body.name;
  newStudent.address = req.body.address;
  newStudent.city = req.body.city;
  newStudent.Postcode = req.body.Postcode;

  newStudent.save(function (err, data) {
    if (err) {
      console.log(error);
    } else {
      res.json("student  inserted");
    }
  });
});

// delete per id
app.delete("/api/students/remove/:student_id", function (req, res) {
  Student.remove(
    {
      _id: req.params.student_id,
    },
    function (err, bear) {
      if (err) res.send(err);
      res.json({
        message: "Successfully deleted",
        studenterimosso: req.params.student_id,
      });
    }
  );
});

// find by Id : students
// http://localhost:3000/api/findById/605373a851ab193fe019c6ba
app.get("/api/students/findbyId/:student_id", function (req, res) {
  Student.findOne({ _id: req.params.student_id }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});



// find by Id : students
// http://localhost:3000/api/students/findbyName/Andrea
app.get("/api/students/findbyName/:name", function (req, res) {
    var nomedacercare=new RegExp(req.params.name);

  Student.find({ name: nomedacercare}, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

// http://localhost:3000/api/lateststud
// retrieving the latest record
app.get("/api/lateststud", function (req, res) {
  Student.find({})
    .sort({ AdmissionDate: -1 })
    .limit(1)
    .exec(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    });
});

app.put("/api/students/update/:id", function (req, res) {
  var student = new Student(); // create a new instance of the student model
  student.name = req.body.name; // set the student name (comes from the request)
  student.id = req.body.id;
  student.city = req.body.city;
  student.address = req.body.address;
  student.Postcode = req.body.Postcode;
  console.log("nome preso " + student.name);

  console.log("server id>>" + req.params.id);
  Student.updateOne(
    { _id: req.params.id },
    {
      name: student.name,
      city: student.city,
      address: student.address,
      Postcode: student.Postcode,
    },

    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    }
  );
});

// get all teachers
app.get("/api/teachers", function (req, res) {
  Teacher.find(function (err, teachers) {
    if (err) res.send(err);
    res.json(teachers);
  });
});

//post con body
app.post("/api/teachers/send", function (req, res) {
  var newTeacher = new Teacher();
  newTeacher.id = req.body.teacher_id;
  newTeacher.name = req.body.name;
  newTeacher.address = req.body.surname;
  newTeacher.city = req.body.city;
  newTeacher.Postcode = req.body.Course;

  newTeacher.save(function (err, data) {
    if (err) {
      console.log(error);
    } else {
      res.json("teacher inserted with success!");
    }
  });
});

// delete per id
app.delete("/api/tremove/:teacher_id", function (req, res) {
  Teacher.remove(
    {
      _id: req.params.teacher_id,
    },
    function (err, bear) {
      if (err) res.send(err);
      res.json({ message: "Successfully deleted" });
    }
  );
});

// find by Id : students
// http://localhost:3000/api/findById/605373a851ab193fe019c6ba
app.get("/api/findbyId/:teacher_id", function (req, res) {
  Teacher.findOne({ _id: req.params.teacher_id }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

// find by Id : students
// http://localhost:3000/api/teachers/findbyCourse/Elettronica
app.get("/api/teachers/findbyCourse/:course", function (req, res) {
  var Course = req.params.Course;
  var value = req.params.value;
  Teacher.findOne({ [name]: value }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

// esempio paginations.
//http://localhost:3000/api/students/pag?page=1&limit=14
app.get("/api/students/pag", paginatedResults(Student), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

// startup our app at http://localhost:3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
