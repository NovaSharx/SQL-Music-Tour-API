// DEPENDENCIES
const events = require('express').Router()
const db = require('../models')
const { Event, Stage, Set_Time, Meet_Greet, Band, Stage_Events } = db
const { Op } = require('sequelize')

// FIND ALL EVENTS
events.get('/', async (req, res) => {
    try {
        const foundEvents = await Event.findAll({
            order: [['date', 'ASC']], // Lists in ascending order
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` } // Can query the name of the event
            }
        })
        res.status(200).json(foundEvents)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC EVENT
events.get('/:name', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: { name: req.params.name },
            include: [
                {
                    model: Meet_Greet,
                    as: "meet_greets",
                    include: {
                        model: Band,
                        as: "band"
                    }
                },
                {
                    model: Set_Time,
                    as: "set_times",
                    include: [
                        {
                            model: Band,
                            as: "band"
                        },
                        {
                            model: Stage,
                            as: "stage"
                        }
                    ]
                },
                {
                    model: Stage,
                    as: "stages",
                    through: { attributes: [] }
                }
            ]
        })
        res.status(200).json(foundEvent)
    } catch (error) {
        res.status(500).json(error)
    }
})

// CREATE AN EVENT
events.post('/', async (req, res) => {
    try {
        const newEvent = await Event.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new event!',
            data: newEvent
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

// UPDATE AN EVENT
events.put('/:id', async (req, res) => {
    try {
        const updatedEvents = await Event.update(req.body, {
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedEvents} event(s)!`
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

// DELETE AN EVENT
events.delete('/:id', async (req, res) => {
    try {
        const deletedEvents = await Event.destroy({
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedEvents} event(s)!`
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

// EXPORT
module.exports = events