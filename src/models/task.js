const mongoose = require('mongoose');
const validator = require('validator');
const taskModel = new mongoose.Schema({
    description: {
        type: String,
        required: true,
         trim:true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: 'User'
    }
    
}, {
    timestamps:true
});

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//          trim:true
//     },
//     completed: {
//         type: Boolean,
//         default: false,
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectID,
//         required: true,
//         ref: 'User'
//     }
    
// })
const Task = mongoose.model('Task', taskModel);
module.exports = Task;