const express = require("express")
const mongoose = require("mongoose")
const dotEnv = require("dotenv")
const pinRoute = require("./routes/pins")
const userRoute = require("./routes/users")
const port = 8800

dotEnv.config()

const app = express()

app.use(express.json())

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('\x1b[42m%s\x1b[0m',"[SUCCESS]Mongo DB connected")
})
.catch((err) => console.log('\x1b[41m%s\x1b[0m',"[FAILED]Mongo DB failed to connect" + err))

app.use("/api/pins",pinRoute)
app.use("/api/users",userRoute)

app.listen(port,() => {
    // console.log(process.env.MONGO_URL)
    console.log('\x1b[42m%s\x1b[0m',`[SUCCESS]Backend server started on port ${port} `)
})