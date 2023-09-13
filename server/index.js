const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./models')
const PORT_NUM = 3002
const cors = require('cors')
app.use(express.json());
app.use(cors());


//Routers Listed
const userRouter = require('./routes/Users')
app.use("/auth", userRouter)


const listRouter = require('./routes/Lists')
app.use("/lists", listRouter)


const taskRouter = require('./routes/Tasks')
app.use("/tasks", taskRouter)



db.sequelize.sync().then(() => {
    app.listen(PORT_NUM, () => {
        console.log('Server initialised on port: ${PORT_NUM}')
    })
});



