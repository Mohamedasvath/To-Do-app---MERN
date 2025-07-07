//using express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')


//create an instance of express
const app = express();
app.use(express.json())
app.use(cors())

//sample in memory storage for todo item
// let todos = []
//connecting mongodb
mongoose.connect('mongodb://localhost:27017/Todo-app')
    .then(() => {
        console.log('DB Connected!');

    })
    .catch((err) => {
        console.log(err);

    })

//creating schema and build model 

const todoSchema = new mongoose.Schema({
    title: {
        required:true,
        type:String
    },
    description: String,

})

//creating model
 const todoModel = mongoose.model('Todo',todoSchema);



//Create a new todo Item

app.post('/todos', async (req, res) => {
  const { title, description } = req.body;
  let newTodo; // Declare it here

  try {
    newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
    console.log(newTodo);
    
  // Now this works!
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message});
  }
});


// get all items 
app.get('/todos', async (req, res) => {

    try {
       const todos = await todoModel.find();
         res.json(todos)
    } catch (error) {
        res.status(500).json({message:error.message});

    }
    res.json(todos)
})

//update Todo Item using Route

app.put('/todos/:id',async (req,res)=>{
    try {
          const { title, description } = req.body;
     const id =  req.params.id;

   const updateTodo = await todoModel.findByIdAndUpdate(
        id,
     {  title,description },
      {new:true}
        
     )
     if (!updateTodo) {
         return res.status(404).json({message:"Todo not Found"})
     }
     res.json(updateTodo)

    } catch (error) {
         console.log(error);
         res.status(500).json({message:error.message});
        
    }
     
})

//Deleting a todo item

app.delete('/todos/:id',async (req,res)=>{

    try {
        
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(200).end()

    } catch (error) {
          console.log(error);
         res.status(500).json({message:error.message});
    }
})


//Start the Server

const port = 8000

app.listen(port, () => {
    console.log("server is listening Port is " + port);

})