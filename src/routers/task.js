const express = require('express');
const Task = require('../models/task');
const auth = require("../middleware/auth");
const router = express.Router();
router.post("/tasks",auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner:req.user._id
    });
    try {
      await task.save();
      res.status(201).send(task);
  
    } catch (e) {
      res.status(500).send(e);
    }
  
    // task
    //   .save()
    //     .then((result) => {
    //       if (!result) {
    //           return res.status(400).send();
    //     }
    //     res.send(result);
    //   })
    //   .catch((err) => {
    //     res.status(400).send(err);
    //   });
  });
  router.get("/tasks",auth,async (req, res) => {
    const match = {}
    if (req.query.completed) {
      match.completed=req.query.completed==='true'
    };
    try {
      // const f = await Task.find({ owner: req.user._id });
      // if (!f) {
      //   res.status(400).send("Not Found");
      // }
      console.log(req.query['limit']);
      await req.user.populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip:parseInt(req.query.skip)
        }
      });
      res.status(200).send(req.user.tasks);
    } catch (e) {
      res.status(500).send(e);
    }
    
    // Task.find({})
    //   .then((result) => {
    //     res.status(200).send(result);
    //   })
    //   .catch((err) => {
    //     res.status(500).send(err);
    //   });
  });
  router.get("/tasks/:id", auth,async (req, res) => {
    const _id = req.params.id;
    try {
      const f = await Task.findOne({ _id, owner: req.user._id });
      if (!f) {
        return res.status(404).send("not exists ");
      }
      res.status(200).send(f);
    } catch (e) {
      res.status(500).send(e);
    }
    // Task.findById(_id)
    //     .then((result) => {
    //         if (!result) {
    //             return res.status(400).send();
    //       }
    //     res.status(200).send(result);
    //   })
    //   .catch((err) => {
    //     res.status(500).send(err);
    //   });
  });
router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = updates.every((t) => allowedUpdates.includes(t));
    if(!isValidUpdate){
      return res.status(400).send("invalid Update");
    }
    try {
      const task = await Task.findOne({_id, owner:req.user._id });
      if (!task) {
        return res.status(404).send("Not found");
      }
     //console.log(task);
      
      updates.forEach((u) => {
        task[u] = req.body[u];
      })
      await task.save();
      //const f = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      res.send(task);
    } catch (e) {
      res.send(e);
    }
  })
  router.delete('/tasks/:id', auth,async (req, res) => {
    try {
      const _id = req.params.id;
      const f = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id });
      if (!f) {
       return  res.status(404).send("not found bro");
      }
      res.send(f);
    } catch (e) {
      res.status(400).send(e);
          }
  
  })

module.exports=router;