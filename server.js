const express = require ("express") ;
const Port = process.env.PORT || 8000; 
const app = express ();
const {MongoClient} = require("mongodb")

const articlesInfo = {
    "learn-react":{
        comments :[],
    }, "learn-node":{
        comments :[],
    }, "learn-react":{
        comments :[],
    },
}

app.use(express.json({extended:false}));

// fetch("a")
// app.get('/', (req, res )=> res.send("hello ") ) ; 
// app.post('/', (req, res )=> res.send(`hello  ${req.body.name}`) ) ; 
// app.get('/hello/:name', (req, res )=> res.send(`Hello ${req.params.name}`) ) ; 

const  withDB = async(operations, res) => {
    try {
       const client = await MongoClient.connect("mongodb://localhost:27017") ; 
       const db = client.db("mern-blog");
      await operations(db)
      
             client.close();}
             catch (error){
             res.status(500).json({message :"error connecting to db " , error})
             }
}

app.get("/api/articles/:name",async(req, res)=>{

    withDB(async (db)=>{   
         const articleName = req.params.name ; 
        const articlesInfo = await db
        .collection("articles").
        findOne({name:articleName })
              .then( 
                console.log("found")
              );
              res.status(200).json(articlesInfo);
     

    },res)


}
)
// compelete get query from db
// app.get("/api/articles/:name",async(req, res)=>{

//     try {
//     const articleName = req.params.name ; 
//    const client = await MongoClient.connect("mongodb://localhost:27017") ; 
//    const db = client.db("mern-blog");
//    const articlesInfo = await db.collection("articles").findOne({name:articleName })
//          .then( 
//            console.log("found")
//          );
//          res.status(200).json(articlesInfo);
//          client.close();}
//          catch (error){
//          res.status(500).json({message :"error connecting to db " , error})
//          }
// })
app.post('/api/articles/:name/add-comments', (req, res )=>{const {username , text } = req.body
const articleName = req.params.article
withDB(async (db)=>{
    const articlesInfo = await db.collection("articles").findOne({name:articleName});
    await db.collection("articles").updateOne({name:articleName}, {$set : {comments :articlesInfo.comments.concat({username , text }),
},
});
const updateArticleInfo = await db.collection("articles").findOne({name:articleName})
res.status(200).json(updateArticleInfo)
},res)
// articlesInfo[articleName].comments.push({username,text})
// res.status(200).send(articleName[articleName])
}
 ) ; 

app.listen(Port ,()=> console.log(`server started at ${Port}`));