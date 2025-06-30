import { createBrowserRouter } from "react-router-dom";
import Login from "../components/LoginForm";
import Home from "../components/Home";

import AddSubjects from "../components/AddSubjects";
import DeleteSubject from "../components/DeleteSubject";
import AddTeachers from "../components/AddTeachers";
import DeleteTeachers from "../components/DeleteTeachers";
import AddLabsAndClasses from "../components/AddLabsAndClasses";
import DeleteLabsAndClasses from "../components/DeleteLabsAndClasses";
import AddTimeSlots from "../components/AddTimeSlots";
import TimetableBuilder from "../components/TimetableBuilder";
import TimetableView from "../components/TimetableView";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />, // 🧠 This includes <Outlet />
    children: [
      {
        index: true,
        element: <div>Welcome to the Dashboard!</div>, // default dashboard content
      },
      {
        path: "add-subjects",
        element: <AddSubjects />,
      },
      {
        path: "delete-subject",
        element: <DeleteSubject />,
      },
      {
        path: "add-teachers",
        element: <AddTeachers />,
      },
      {
        path: "delete-teachers",
        element: <DeleteTeachers />,
      },
      {
        path: "add-labs-classes",
        element: <AddLabsAndClasses />,
      },
      {
        path: "delete-labs-classes",
        element: <DeleteLabsAndClasses />,
      },
      {
        path: "add-time-slots",
        element: <AddTimeSlots />,
      },
      {
        path: "timetable-builder",
        element: <TimetableBuilder />,
      },
      {
        path: "timetable-view",
        element: <TimetableView />,
      },
    ],
  },
]);

export default router;
