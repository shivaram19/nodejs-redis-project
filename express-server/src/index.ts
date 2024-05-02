import express from "express"
// hey what's happening
import { createClient } from "redis"

const app = express()
app.use(express.json())

const client = createClient();
client.on("error", function(err){
	console.log("redis cleint error", err)
})

app.post("/submit",async function(req, res){
	const { problemId, userId, code , language } = req.body
	// push this to database
	try {
		await client.lPush("submissions", JSON.stringify({ problemId, userId, code , language }))
			res.json({
			message:"submission received"
		})
	} catch (error) {
		console.log("reddis -error", error)
		res.json({
			message:"submission failed"
		})
	} 

})
		
async function startServer(){
	try {
		await client.connect()
		console.log("connected to redis ")
		app.listen(8070, function(){
			console.log("server is connected")
		})
	} catch (error) {
		console.log("redis connection error ", error)
	}
}

startServer()