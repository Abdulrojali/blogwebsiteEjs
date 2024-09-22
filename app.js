const express =require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const bcrypt = require('bcrypt')
const methodOverride=require('method-override')


const accounts = require('./models/accounts')
const blogs=require('./models/blog')

app.use(methodOverride('_method'));
app.use(methodOverride('X-HTTP-Method'))        
app.use(methodOverride('X-HTTP-Method-Override'))  
app.use(methodOverride('X-Method-Override'))

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.set('view engine','ejs')
app.set(path.join(__dirname,'views'))

app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/',async(req,res)=>{
    const blogsData=await blogs.find({})
            if(blogsData){
                res.status(200).render('home',{blogsData})
            }
            else{
                res.status(301).send('invalid to get Data')
            }
})
app.get('/dashboard',async(req,res)=>{
    const getBlogs=await blogs.find({})
    if(getBlogs){
        res.status(200).render('dashboard',{getBlogs})
    }
    else{
        res.status(300).send('invalid to get Blogs')
    }
})
app.get('/404',(req,res)=>{
    res.render('404')
})
app.get('/createAccount',(req,res)=>{
    res.render('createAccount')
})
app.get('/add',(req,res)=>{
    res.render('add')
})
app.get('/views/:id',async(req,res)=>{
    try{
        const {id}=req.params
        if(id){
            const findData=await blogs.findOne({_id:id})
            if(findData){
                res.render('views',{findData})
            }
           else{
            res.status(300).send('invalid get id')
           }
        }
        else{
            res.render('404')
        }
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
})
app.get('/delete',async(req,res)=>{
    const getBlogs=await blogs.find({})
    if(getBlogs){
        res.status(200).render('delete',{getBlogs})
    }
    else{
        res.status(300).send('invalid to get Blogs')
    }
})
app.delete('/deleteData/:id',async(req,res)=>{
    try{
        const {id} = req.params 
        const findByIdAndUpdateData=await blogs.findOneAndDelete({_id:id})
        if(findByIdAndUpdateData){
                res.status(200).redirect('/delete')
        }
        else{
            res.status(300).send('invalid not found id!!')
        }
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
})

app.get('/history',async(req,res)=>{
    try{
        const getHistory = await historyData.find({})
        res.status(200).render('history',{getHistory})
    }
    catch(Err){
        res.status(404)
        throw new Error(Err)
    }
})
app.get('/edit',async(req,res)=>{
    const getBlogs=await blogs.find({})
    if(getBlogs){
        res.status(200).render('edit',{getBlogs})
    }
    else{
        res.status(300).send('invalid to get Blogs')
    }
})
app.get('/editData/:id',(req,res)=>{
    const {id} =req.params
    res.render('editData',{id})
})
app.put('/editData/:id',async(req,res)=>{
    try{
        const {id} = req.params
        const{judul,submenu,context,tanggal}=req.body
        const EditData=await blogs.findByIdAndUpdate(id,
        {
            tittle:judul,
            subject:submenu,
            content:context,
            dateCreate:tanggal
        })
        if(EditData){
            res.status(200)
            res.redirect('/dashboard')
        }
        else{
            res.status(300).send('invalid edit data!!!')
        }
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
})
app.post('/login',async(req,res)=>{
    try{
        const {username,password} = req.body
        const auhtorizationUsername = await accounts.findOne({username :username})
        if(auhtorizationUsername){
            const authorizationPassword=await bcrypt.compareSync(password,auhtorizationUsername.password)
            if(authorizationPassword){
                res.redirect('/dashboard')
            }
            else{
                res.status(300).send('invalid login. password salah')
            }
        }
        else{
            res.status(300).send('invalid not found username')
        }
    }
    catch(Err){
        res.status(404).redirect('/404')
    }
})
app.post('/createAccount',async(req,res)=>{
    try{
        res.status(200)
        const {name,username,email,password} = req.body
        const salt=await bcrypt.genSalt(10)
        const hashPass=await bcrypt.hashSync(password,salt)
        if(name,username,email,hashPass){
            const newAccounts =new accounts({
                name:name,
                email:email,
                username:username,
                password:hashPass
            })
            if(newAccounts){
                await newAccounts.save()
                res.redirect('/login')
            }
            else{
                res.status(300).send('invalid login not found password')
            }
        }
        else{
            res.status(300).send('invalid login not found username')
        }
    }
    catch(err){
        res.status(404)
        throw new Error(err)
    }
})
app.post('/add',async(req,res)=>{
    try{
        const {tittle,subject,content,dateCreate}=req.body
        res.status(200)
        const blogss=new blogs({
            tittle:tittle,
            subject:subject,
            content:content,
            dateCreate:dateCreate
        })
        if(blogss){
            await blogss.save()
            res.redirect('/dashboard')
        }
        else{
            res.status(300).send('invalid to add new blogs')
        }
    }   
    catch(err){
        res.status(404)
        throw new Error(err)
    } 
})
app.listen(8080,()=>{
    console.log('http://localhost:8080')
})