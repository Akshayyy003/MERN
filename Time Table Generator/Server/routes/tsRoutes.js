const express = require('express');
const router = express.Router();
const TS = require('../models/timeSlots')

router.post('/add', async (req, res) => {
    try {
        const { branch, slotlen, breakLen, slotsBeforeBreak, startTime } = req.body;
        // ✅ Basic validation
        const existingTS = await TS.findOne({ branch });
        if (existingTS) {
            return res.status(400).json({ message: "Time Slot for this branch already exists" });
        }

        if (!branch || !slotlen || !breakLen || !slotsBeforeBreak || !startTime) {
            return res.status(400).json("All fields are required");
        }


        // ✅ Save new Locations
        const newTimeSlots = await TS.create({
            branch,
            slotlen,
            breakLen,
            slotsBeforeBreak,
            startTime
        });
        res.status(201).json({ message: "success" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json("Internal server error");
    }
});



module.exports = router;
