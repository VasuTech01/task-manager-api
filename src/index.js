const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const jwt = require('jsonwebtoken');
const app = express();
const Task = require('./models/task');
const User = require('./models/User');
const port = process.env.PORT;
// app.use((req, res, next) => {
//   res.status(503).send('Site under maintenance pls visit soon');

// })
// const multer = require('multer');
// const upload = multer({
//   dest:'images'
// });

// app.post('/upload', upload.single('upload'), (req, res) => {
//   res.send();
// })
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
// const myFunct = async()=> {
//   // const token = jwt.sign({ _id: "abc@123" }, 'hellowWorld', { expiresIn: "5 seconds" });
// //   console.log(token);
// //   const data = jwt.verify(token, 'hellowWorld');
// //   console.log(data);
//   // const task = await Task.findById('61e410ed91c9e5e0a0f1c79b');
//   // await task.populate('owner');
//   // console.log(task.owner);
//   // const user = await User.findById('61e40d85f27c567f30e048dd');
//   // await user.populate('tasks');
//   // console.log(user.tasks);

// }
//myFunct();


app.listen(port, () => {
  console.log("Connected to the port" + port);
});
