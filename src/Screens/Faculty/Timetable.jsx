import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
import TimePicker from 'react-time-picker';
import TimeInput from "./TimeInput";

const Timetable = () => {
  const [addselected, setAddSelected] = useState({
    branch: "",
    semester: "",
    timetable: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
    },
  });
  const [branch, setBranch] = useState();
  const [currentDay, setCurrentDay] = useState("monday");
  const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
  const [currentFaculty, setCurrentFaculty] = useState("");
  const [currentSubject, setCurrentSubject] = useState();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getBranchData();
    getSubjects();
  }, []);

  const getBranchData = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(`${baseApiURL()}/branch/getBranch`, { headers })
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          setBranch(response.data.branches);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  const getSubjects = () => {
    axios
    .get(`${baseApiURL()}/subject/getSubject`)
    .then((response) => {
      if (response.data.success) {
        setSubjects(response.data.subject);
        setCurrentSubject(response.data.subject[0]?.name);
      } else {
        toast.error(response.data.message);
      }
    })
    .catch((error) => {
      toast.error(error.message);
    });
  }
  
  const handleAddSchedule = () => {
    setAddSelected(prevState => {
      const currentDaySchedule = prevState.timetable[currentDay] || [];
      const timeSlotIndex = currentDaySchedule.findIndex(slot => slot.timing === `${startTime}-${endTime}`);
  
      if (timeSlotIndex !== -1) {
        currentDaySchedule[timeSlotIndex] = { timing: `${startTime}-${endTime}`, faculty: currentFaculty, subject: currentSubject };
      } else {
        currentDaySchedule.push({ timing: `${startTime}-${endTime}`, faculty: currentFaculty, subject: currentSubject });
      }
  
      return {
        ...prevState,
        timetable: {
          ...prevState.timetable,
          [currentDay]: currentDaySchedule,
        },
      };
    });
   
    setCurrentFaculty("");
  };
  useEffect(() => {
    if (branch && branch.length > 0) {
      setAddSelected(prevState => ({ ...prevState, branch: branch[0]._id}));
    }
  }, [branch]);
  useEffect(() => {
    if (subjects && subjects.length > 0) {
      setAddSelected(prevState => ({ ...prevState, subjects: subjects[0].name}));
    }
  }, [subjects]);
  
  useEffect(() => {
    setAddSelected(prevState => ({ ...prevState, semester: "1" }));
  }, []);
  const addTimetableHandler = () => {
    toast.loading("Adding Timetable");
    console.log(addselected);
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(`${baseApiURL()}/timetable/addTimetable`, addselected, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setAddSelected({
            branch: "",
            semester: "",
            timetable: {
              monday: [],
              tuesday: [],
              wednesday: [],
              thursday: [],
              friday: [],
            },
          });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        console.log("Error", error);
        toast.error(error.response.data.message);
      });
  };
  const timeSlots = [...new Set(Object.values(addselected.timetable).flat().map(schedule => schedule.timing))];
  console.log(branch);
  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title={`Create Timetable`} />
      </div>
      <div className="w-full flex justify-evenly items-center mt-12">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <p className="mb-4 text-xl font-medium">Create Timetable</p>
          <select
  value={addselected.branch}
  onChange={(e) =>
    setAddSelected({ ...addselected, branch: e.target.value })
  }
  className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4"
>
  {branch?.map((b) => (
    <option key={b._id} value={b._id}>
      {b.name}
    </option>
  ))}
</select>

<select
  value={addselected.semester}
  onChange={(e) =>
    setAddSelected({ ...addselected, semester: e.target.value })
  }
  className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4"
>
  {["1", "2", "3", "4", "5", "6", "7", "8"].map((semester) => (
    <option key={semester} value={semester}>
      {semester}
    </option>
  ))}
</select>
          <select
            value={currentDay}
            onChange={(e) => setCurrentDay(e.target.value)}
            className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4"
          >
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>
          
          <select
  value={currentSubject}
  defaultValue={subjects[0]?.name}
  onChange={(e) => setCurrentSubject(e.target.value)}
  className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4"
>
  {subjects.map((subject) => (
    <option key={subject.code} value={subject.name}>
      {subject.name}
    </option>
  ))}
</select>
 <input
            type="text"
            value={currentFaculty}
            onChange={(e) => setCurrentFaculty(e.target.value)}
            placeholder="Enter faculty name"
            className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4"
          />
                <div>
      <TimeInput label="Start Time" value={startTime} onChange={setStartTime} />
      <TimeInput label="End Time" value={endTime} onChange={setEndTime} />
    </div>
         
          <button
            onClick={handleAddSchedule}
            className="bg-blue-500 text-white mt-8 px-4 py-2 rounded-sm"
          >
            Add Schedule
          </button>


<table className="table-auto w-full">
  <thead>
    <tr>
      <th className="border px-4 py-2">Timing</th>
      <th className="border px-4 py-2">Monday</th>
      <th className="border px-4 py-2">Tuesday</th>
      <th className="border px-4 py-2">Wednesday</th>
      <th className="border px-4 py-2">Thursday</th>
      <th className="border px-4 py-2">Friday</th>
    </tr>
  </thead>
  <tbody>
    {timeSlots.map((timeSlot, index) => (
      <tr key={index}>
        <td className="border px-4 py-2">{timeSlot}</td>
        {Object.keys(addselected.timetable).map((day) => {
          const schedule = addselected.timetable[day].find((s) => s.timing === timeSlot);
          return (
            <td key={day} className="border px-4 py-2">
  {schedule ? `${schedule.faculty}/ ${schedule.subject}` : ''}
</td>
          );
        })}
      </tr>
    ))}
  </tbody>
</table>
          <button
            onClick={addTimetableHandler}
            className="bg-blue-500 text-white mt-8 px-4 py-2 rounded-sm"
          >
            Add Timetable
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timetable;