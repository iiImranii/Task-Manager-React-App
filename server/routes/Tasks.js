const express = require('express');
const router = express.Router();
const { Tasks, Lists } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');


router.get('/getTask/:taskId/list/:listId', validateToken, async (req, res)=> {
    const taskId = req.params.taskId;
    const listId = req.params.listId;
    const task = await Tasks.findOne({where: {
        id: taskId,
        ListId: listId
    }})

    if (task) {
        res.json({
            tasknote: task.tasknote,
            taskcomplete: task.taskcomplete,
            taskname: task.taskname,
            taskduration: task.taskduration,
            createdAt: task.createdAt
        });
    } else {
        res.json({err: "Task does not exist"});
    }
})

router.delete('/deleteTask/list/:listId/:taskId', validateToken, async(req, res)=> {
    const userId = req.user.id;
    const taskId = req.params.taskId;
    const listId = req.params.listId;
    const lists = await Lists.findOne({where : {
        id: listId,
        UserId: userId,
    }})

    if (lists) {
        const task = await Tasks.findOne({ where : {
            id: taskId,
            ListId: listId
        }})
        if (task) {
            task.destroy();
            res.json("Task has successfully been destroyed!")
        }
    }
})

router.post('/task-complete/:taskId/list/:listId', validateToken, async (req,res)=> {
    const taskId = req.params.taskId;
    const listId = req.params.listId;
    const task = await Tasks.findOne({where: {
        id: taskId,
        ListId: listId
    }})

    if (task) {
        const toSet = req.body.bool;
        try {
            const idk = await task.update({ taskcomplete: toSet })

            res.json({taskComplete: toSet});
              //  if (result[0]==1) {
              //      
              //  } else {
              //      res.json({err: "Task not found or updated"}) ;
              //  }
           
        } catch (error) {
            res.json({err: "Error updating task: ", error});
        }  
    } else {
        res.json({err: "Task does not exist"});
    }
})


router.get('/getAllTasks/list/:listId', validateToken ,async (req, res) => {
    const userId = req.user.id;
    const listId = req.params.listId;

    
    const lists = await Lists.findOne({where : {
        id: listId,
        UserId: userId,
    }})

    if (!lists) {
        //There doesnt exist a list to even view any tasks or list doesnt belong to user
        res.json({err: "List does not exist or does not belong to user!"})

    } else {
        //List exists and belongs to user
        const tasks = await Tasks.findAll({where: {
            ListId: listId
        }})
    
        res.json(tasks)


    }
})

router.put('/editTask/:taskId/list/:listId', validateToken, async (req, res) => {
    const listId = req.params.listId;
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const newTaskName = req.body.taskname;
    const newTaskTimeSpan = req.body.timespan;
    const newTaskNote = req.body.tasknote;



    try {
        const lists = await Lists.findOne({where : {
            id: listId,
            UserId: userId,
        }})
    
        if (lists) {
            //There doesnt exist a list to even view any tasks or list doesnt belong to user
            
            const task = await Tasks.findOne({where : {
                id: taskId,
                ListId: listId,
            }})
            if (task) {
                task.taskduration = newTaskTimeSpan
                task.tasknote = newTaskNote
                task.taskname = newTaskName
                await task.save();
                res.json("Successfully updated task")
            } else {
                res.json({err: "Task does not exist"})
            }
    
        } else {
            res.json({err: "List does not exist or does not belong to user!"})
        }
    
    } catch (error) {
        res.json({err: error})
    }
    
})


router.post('/createTask/list/:listId',validateToken ,async (req, res) => {

    const userId = req.user.id;
    const listId = req.params.listId;

    const lists = await Lists.findOne({where : {
        id: listId,
        UserId: userId,
    }})

    if (!lists) {
        //There doesnt exist a list to even view any tasks or list doesnt belong to user
        res.json({err: "List does not exist or does not belong to user!"})

    } else {

        const taskName = req.body.taskname;
        const taskNote = req.body.tasknote;
        const taskDuration = req.body.timespan;


        const existingTask = await Tasks.findOne({where: {taskname: taskName}});

        if (existingTask) {
            res.json({err:"Task already exists!"})
        } else {
            await Tasks.create({
                taskname: taskName,
                tasknote: taskNote,
                taskduration: taskDuration,
                taskcomplete: false,
                ListId: listId,
            })
            res.json("Successfully created task")
        }
        
    }

})



module.exports = router;