const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/blogs')
.then((res)=>console.log(res))
.catch((err)=>console.log(err))

const schema =new mongoose.Schema({
    deleteBlogs:{
        type:Array,
    }
})
const historyData= mongoose.model('historyData',schema)
module.exports=historyData