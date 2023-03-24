const express=require('express')
const { ObjectId } = require('mongodb')
const {connectToDb, toDb}= require('./db')
//inti app and middleware

const app=express()
app.use(express.json())
//dbconnection
let db
connectToDb((err)=>{
    if(!err){
        app.listen(3000,()=>{
            console.log('app listening on port 3000')
        })
    }
    db=toDb()
})


//routes
app.get('/books',(req,res)=>{
    let books=[]
    const page=req.query.p || 0
    const booksPerPage = 3
    db.collection('books')
    .find()
    .sort({rating:1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book=>books.push(book))
    .then(()=>{
        res.status(200).json(books)
    })
    .catch(()=>{
        res.status(500).json({error:"cannot fetch the documents"})
    })
    
})

app.get('/books/:id',(req,res)=>{

    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc=>{
            res.status(200).json(doc)
        })
        .catch(err=>{
            res.status(500).json({error:"cannot fetch the documents single mode"})
        })
    }
    else{
        res.status(500).json({error:"Not valid document id"})
    }

    
})

app.post('/books',(req,res)=>{
    const book = req.body
    db.collection('books')
    .insertOne(book)
    .then(doc=>{
        res.status(201).json(doc)
    })
    .catch(err=>{
        res.status(500).json({error:"Not posted the documents"})
    })
})

app.delete('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(doc=>{
            res.status(200).json(doc)
        })
        .catch(err=>{
            res.status(500).json({error:"cannot delete the document"})
        })
    }
    else{
        res.status(500).json({error:"Not valid document id"})
    }
})

app.patch('/books/:id',(req,res)=>{
    const updates = req.body

    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)},{$set:updates})
        .then(doc=>{
            res.status(200).json(doc)
        })
        .catch(err=>{
            res.status(500).json({error:"cannot delete the document"})
        })
    }
    else{
        res.status(500).json({error:"Not valid document id"})
    }
})