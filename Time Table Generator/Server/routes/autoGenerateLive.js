// // routes/generate.js
// const express = require('express');
// const router = express.Router();
// const { generateTimetable } = require('../utils/timetableGenerator');

// // routes/autoGenerateLive.js
// router.post('/auto-generate-live', async (req, res) => {
//   try {
//     const { branch, semester } = req.body;
    
//     if (!branch || !semester) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Branch and semester are required" 
//       });
//     }

//     const timetable = await generateTimetable(
//       branch.toLowerCase(), 
//       parseInt(semester)
//     );
//     console.log(timetable)
    
//     res.json({
//       success: true,
//       timetable
//     });
    
//   } catch (error) {
//     console.error("Generation error:", error);
//     const statusCode = error.message.includes("Invalid") ? 400 : 500;
//     res.status(statusCode).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// module.exports = router;