const mongoose = require('mongoose');
mongoose.connect(process.env.Mongodb_URL, {
    useNewUrlParser: true,
})


// const obj1 = new Task({
//     description: "VASU saini",
// })
// obj1.save().then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })

// const obj = new User({
//     name: "abbhi",
//     email: "vasu@gmail.com",
//     age: 21,
//     password:'vaspassha'
// })
// obj.save().then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })

