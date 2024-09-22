const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/blogs')
.then((res)=>console.log(res))
.catch((err)=>console.log(err))
const schema = new mongoose.Schema({
    tittle:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    dateCreate:{
        type:Date,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'accounts'
    }
})

const blogs = mongoose.model('blogs',schema)
module.exports=blogs