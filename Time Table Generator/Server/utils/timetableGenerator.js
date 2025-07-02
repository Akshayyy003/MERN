const Teacher = require('../models/users');
const Location = require("../models/LabClass");
const Subject = require("../models/subjects");
const TS = require("../models/timeSlots");

const generateTimetable = async (branch, semester) => {
    // 1. Fetch all required data
    const [teachers, subjects, locations, config] = await Promise.all([
        Teacher.find({ branch }).catch(() => []),
        Subject.find({ branch, semester }).catch(() => []),
        Location.find({ branch }).catch(() => []),
        TS.findOne({ branch }).catch(() => null)
    ]);

    // 2. Validate all required data exists
    if (!teachers?.length) throw new Error("No teachers found for this branch");
    if (!subjects?.length) throw new Error("No subjects found for this branch/semester");
    if (!locations?.length) throw new Error("No locations available for this branch");
    if (!config) throw new Error("Time slot configuration not found");

    // 3. Generate room names based on location configuration
    const generateRoomNames = (location) => {
        const rooms = [];
        const classPrefix = location.prefix + 'C'; // Classroom prefix (e.g., "CSE1C")
        const labPrefix = location.prefix + 'L';   // Lab prefix (e.g., "CSE1L")
        
        // Generate classroom names (C1, C2, etc.)
        for (let i = 1; i <= parseInt(location.numberOfClasses); i++) {
            rooms.push(`${classPrefix}${i}`);
        }
        
        // Generate lab names (L1, L2, etc.)
        for (let i = 1; i <= parseInt(location.numberOfLabs); i++) {
            rooms.push(`${labPrefix}${i}`);
        }
        
        return rooms;
    };

    // Flatten all rooms from all locations
    const allRooms = locations.flatMap(loc => generateRoomNames(loc));

    // 4. Validate and calculate slots
    const slotsBeforeBreak = parseInt(config.slotsBeforeBreak) || 0;
    const slotsAfterBreak = parseInt(config.slotsAfterBreak) || 0;
    const breakLen = parseInt(config.breakLen) || 0;
    
    if (slotsBeforeBreak < 0 || slotsAfterBreak < 0 || breakLen < 0) {
        throw new Error("Invalid time slot configuration: negative values not allowed");
    }

    const totalSlots = slotsBeforeBreak + slotsAfterBreak + 1;
    
    if (totalSlots <= 0 || totalSlots > 20) {
        throw new Error(`Invalid total slots: ${totalSlots}. Must be between 1-20`);
    }

    // 5. Initialize timetable
    const timetable = {};
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    DAYS.forEach(day => {
        timetable[day] = new Array(totalSlots).fill(null);
    });

    // 6. Define helper functions
    const getAvailableResources = (day, slotIdx, duration = 1) => {
        const availableTeachers = teachers.filter(teacher => {
            for (let i = 0; i < duration; i++) {
                if (constraints.teacherAvailability.get(teacher._id).has(`${day}-${slotIdx + i}`)) {
                    return false;
                }
            }
            return true;
        });

        const availableRooms = allRooms.filter(room => {
            for (let i = 0; i < duration; i++) {
                if (constraints.roomAvailability.get(room).has(`${day}-${slotIdx + i}`)) {
                    return false;
                }
            }
            return true;
        });

        return { availableTeachers, availableRooms };
    };

    const hasConsecutiveAssignment = (day, slotIdx, subject, teacher) => {
        // Check previous slot
        if (slotIdx > 0 && timetable[day][slotIdx - 1] && !timetable[day][slotIdx - 1].skip) {
            const prev = timetable[day][slotIdx - 1];
            if (prev.subject === subject || prev.teacher === teacher) return true;
        }
        // Check next slot
        if (slotIdx < totalSlots - 1 && timetable[day][slotIdx + 1] && !timetable[day][slotIdx + 1].skip) {
            const next = timetable[day][slotIdx + 1];
            if (next.subject === subject || next.teacher === teacher) return true;
        }
        return false;
    };

    // 7. Track constraints
    const constraints = {
        teacherAvailability: new Map(teachers.map(t => [t._id, new Set()])),
        roomAvailability: new Map(allRooms.map(r => [r, new Set()])),
        subjectRequirements: new Map(subjects.map(s => [
            s.subName, 
            { lectures: s.lec, labs: s.lab, assignedLectures: 0, assignedLabs: 0 }
        ])),
        lastAssignedSubject: new Map(DAYS.map(day => [day, null])),
        lastAssignedTeacher: new Map(DAYS.map(day => [day, null]))
    };

    // 8. Process subjects by priority (most requirements first)
    const prioritizedSubjects = [...subjects].sort((a, b) => 
        (b.lec + b.lab) - (a.lec + a.lab)
    );

    for (const subject of prioritizedSubjects) {
        const requirements = constraints.subjectRequirements.get(subject.subName);
        
        // Assign lectures first
        while (requirements.assignedLectures < requirements.lectures) {
            let assigned = false;
            
            for (const day of DAYS) {
                for (let slotIdx = 0; slotIdx < totalSlots; slotIdx++) {
                    if (slotIdx === config.slotsBeforeBreak) continue;
                    if (timetable[day][slotIdx]) continue;

                    const { availableTeachers, availableRooms } = getAvailableResources(day, slotIdx);
                    const filteredTeachers = availableTeachers.filter(teacher => 
                        !hasConsecutiveAssignment(day, slotIdx, subject.subName, teacher.name)
                    );

                    if (filteredTeachers.length && availableRooms.length) {
                        const teacher = filteredTeachers[
                            Math.floor(Math.random() * filteredTeachers.length)
                        ];
                        const room = availableRooms[
                            Math.floor(Math.random() * availableRooms.length)
                        ];
                        
                        timetable[day][slotIdx] = {
                            type: "Lecture",
                            subject: subject.subName,
                            teacher: teacher.name,
                            room: room
                        };
                        
                        constraints.teacherAvailability.get(teacher._id).add(`${day}-${slotIdx}`);
                        constraints.roomAvailability.get(room).add(`${day}-${slotIdx}`);
                        constraints.lastAssignedSubject.set(day, subject.subName);
                        constraints.lastAssignedTeacher.set(day, teacher.name);
                        requirements.assignedLectures++;
                        assigned = true;
                        break;
                    }
                }
                if (assigned) break;
            }
            
            if (!assigned) {
                console.warn(`Could not assign all lectures for ${subject.subName}`);
                break;
            }
        }
        
        // Then assign labs
        while (requirements.assignedLabs < requirements.labs) {
            let assigned = false;
            
            for (const day of DAYS) {
                for (let slotIdx = 0; slotIdx < totalSlots - 1; slotIdx++) {
                    if (slotIdx === config.slotsBeforeBreak || slotIdx + 1 === config.slotsBeforeBreak) continue;
                    if (timetable[day][slotIdx] || timetable[day][slotIdx + 1]) continue;
                    
                    const { availableTeachers, availableRooms } = getAvailableResources(day, slotIdx, 2);
                    const filteredTeachers = availableTeachers.filter(teacher => 
                        !hasConsecutiveAssignment(day, slotIdx, subject.subName, teacher.name)
                    );

                    if (filteredTeachers.length && availableRooms.length) {
                        const teacher = filteredTeachers[
                            Math.floor(Math.random() * filteredTeachers.length)
                        ];
                        const room = availableRooms[
                            Math.floor(Math.random() * availableRooms.length)
                        ];
                        
                        timetable[day][slotIdx] = {
                            type: "Lab",
                            subject: subject.subName,
                            teacher: teacher.name,
                            room: room
                        };
                        timetable[day][slotIdx + 1] = { skip: true };
                        
                        constraints.teacherAvailability.get(teacher._id)
                            .add(`${day}-${slotIdx}`)
                            .add(`${day}-${slotIdx+1}`);
                        constraints.roomAvailability.get(room)
                            .add(`${day}-${slotIdx}`)
                            .add(`${day}-${slotIdx+1}`);
                        constraints.lastAssignedSubject.set(day, subject.subName);
                        constraints.lastAssignedTeacher.set(day, teacher.name);
                        requirements.assignedLabs++;
                        assigned = true;
                        break;
                    }
                }
                if (assigned) break;
            }
            
            if (!assigned) {
                console.warn(`Could not assign all labs for ${subject.subName}`);
                break;
            }
        }
    }

    return timetable;
};

module.exports = { generateTimetable };