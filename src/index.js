const express = require('express');
const app = express();
const port = 3000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask= require("../models/TodoTask");
dotenv.config();

mongoose.connect(process.env.DB_CONNECT).then(
  app.listen(port, () => console.log("Server Up and running"
  )))
  
  console.log("Connected to db!");
  
  app.use("/static", express.static("public"));
  
  app.use(express.urlencoded({ extended: true }));
  
  app.set("view engine", "ejs");
  
  app.get('/', async (req, res) => {
    const tasks = await TodoTask.find({});
    res.render("todo.ejs", { TodoTask: tasks });
  });
  
  app.post('/', async(req, res) => {
    const newTask = new TodoTask({
      content: req.body.content
    });
    try {
      await newTask.save();
      res.redirect('/'); 
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  app.route("/edit/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    try {
      const tasks = await TodoTask.find({});
      res.render("todoEdit.ejs", { TodoTask: tasks, idTask: id });
    } catch (err) {
      res.status(500).send(err.message); 
    }
  })
  .post(async (req, res) => {
    const id = req.params.id;
    try {
      const updatedTask = await TodoTask.findByIdAndUpdate(id, { content: req.body.content }, { new: true });
      if (!updatedTask) {
        return res.status(404).send("Task not found");
      }
      res.redirect("/"); 
    } catch (err) {
      res.status(500).send(err.message); 
    }
  });

  app.route("/remove/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
      const result = await TodoTask.findByIdAndDelete(id);
      res.redirect("/");
    } catch (err) {
      res.status(500).send(err);
    }
  });
  