const express = require('express');
const router = express.Router();
const { Lists, Tasks } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');



router.get('/getAllLists', validateToken, async (req, res) => {
    console.log("In get all lists")
    const userId = req.user.id;
    const lists = await Lists.findAll({where : {UserId : userId}});
    res.json(lists)
});

router.get("/getCompleted/list/:listId", validateToken, async (req, res)=>{
    const userId = req.user.id;
    const listId = req.params.listId;

    const existList = await Lists.findOne({where : {
        id: listId,
        UserId: userId
    }})

    if (existList) {
        const completedTasksEntry = await Tasks.findAll({where: {
            taskcomplete: true,
            ListId: existList.id,
        }
        })

        const totalTasksEntry = await Tasks.findAll({where: {
            ListId: existList.id,
        }
        })
        res.json({totalTasks: totalTasksEntry.length, completedTasks: completedTasksEntry.length})
    } else {
        res.json({err: "List could not be found!"})
    }
})

router.delete('/deleteList/:listId', validateToken, async (req, res)=> {
    const listId = req.params.listId;
    const userId = req.user.id;

    try {
        const list = await Lists.findOne({where: {
            id: listId,
            UserId: userId
        }})
        if (list) {
            list.destroy();
            res.json("List has successfuly been deleted!");
        } else {
            res.json({err: "List does not exist"});
        }
    } catch (error) {
        res.json({err: error});
    }
})

router.post('/createList', validateToken, async (req, res) => {
    const listName = req.body.listname;
    const userId = req.user.id
    const existingList = await Lists.findOne({where : {
        listname: listName,
        UserId: userId
    }});
 
    if (existingList) {
        res.json({err: "List already exists"})

    } else {
        await Lists.create({
            listname: listName,
            UserId: userId
        })
        res.json("Successfully created list!")
    }
});

router.get('/getList/:listId', validateToken, async (req, res)=> {
    const listId = req.params.listId;
    const userId = req.user.id;

    try {

        const list = await Lists.findOne({where:{
            id: listId,
            UserId: userId,
        }})
        if (list) {
            res.json({listname: list.listname})

        } else {
            res.json({err: "List doesnt exist"})
        }
    } catch (error) {
            res.json({err: "Error occured looking for list, try again later!"})
    }

});

router.put('/editList/:listId', validateToken, async (req, res) => {
    const listName = req.body.listname;
    const userId = req.user.id;
    const listId = req.params.listId; // Get the list ID from the URL parameter

    try {
        // Check if the list with the provided ID exists
        const existingList = await Lists.findOne({
            where: {
                id: listId,
                UserId: userId,
            },
        });

        if (!existingList) {
            return res.json({ err: 'List not found' });
        }

        // Update the list name
        existingList.listname = listName;
        await existingList.save();
        res.json('Successfully updated list');
    } catch (error) {
        res.json({ err: 'An error occurred while updating the list' });
    }
});

module.exports = router;