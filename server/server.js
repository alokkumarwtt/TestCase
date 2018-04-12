const _ = require('lodash');
const {ObjectId}=require('mongodb')
const express=require('express')
const bodyParser=require('body-parser')

var {mongoose}=require('./db/mongoose.js')
var {mon}=require('./model/blogsmodel.js')
var app=express()
app.use(bodyParser.json());
app.post('/mons',(req,res)=>{
	var mon1=new mon({
		title:req.body.title,
		tags:req.body.tags,
		body:req.body.body,
		author:req.body.author,
		creation_date:req.body.creation_date,
		update_date:req.body.update_date,
		status:req.body.status,
	})
	mon1.save().then((doc)=>{
    res.send(doc)
    },(e)=>{
    res.status(400).send(e)
})
})
app.get('/mons',(req,res)=>{
	mon.find().then((mons)=>{
		res.send({mons})

	},(e)=>{
		res.status(400).send(e)
	})
})
app.get('/mons/:id',(req,res)=>{
	var id=req.params.id
	 //console.log(id)
	if(!ObjectId.isValid(id)){
		return res.status(404).send();
  }
   mon.findById(id).then((mons)=>{
  	 //  if (!mons) {
    //   return res.status(404).send();
    // }

   res.send({mons});
     },(e) => {
    res.status(400).send(e);
  });
  })
 app.get('/blogs/:title',(req,res)=>{
  	var title=req.params.title;
  	mon.find({"title":title}).then((result)=>{
  		res.send(result)
  	},(err)=>{
  		res.status(400).send(err)
  	})
  })

  app.delete('/mons/:id',(req,res)=>{

     var id=req.params.id

	if(!ObjectId.isValid(id)){
		return console.log('Invalid id error of 404')
	}
	mon.findByIdAndRemove(id).then((mons)=>{
		res.send({mons});
    },(err)=>{
		res.status(400).send();
	})
})
   app.patch('/mons/:id', (req,res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['title']);
    if (!ObjectId.isValid(id)) {
    return res.status(404).send();
    }
    mon.findByIdAndUpdate(id, {$set: body}, {new: true}).then((mons) => {
         res.send({mons});
   },(err)=>{
		res.status(400).send();
	})
});


app.listen(3000,()=>{
	console.log('Started on port 3000')
})
module.exports = {app};