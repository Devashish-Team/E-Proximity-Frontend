import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    const getTimetable = () => {
      const headers = {
        "Content-Type": "application/json",
      };
      axios
        .get(
          `${baseApiURL()}/timetable/getTimetable`,
          { semester: userData.semester, branch: userData.branch },
          {
            headers: headers,
          }
        )
        .then((response) => {
          if (response.data.length !== 0) {
            setTimetable(response.data[0].timetable);
          }
        })
        .catch((error) => {
          toast.dismiss();
          console.log(error);
        });
    };
    userData && getTimetable();
  }, [userData, userData.branch, userData.semester]);
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const currentDay = days[new Date().getDay()];

const now = new Date(`1970/01/01 ${new Date().toTimeString().split(' ')[0]}`).getTime();

console.log(now);
return (
  <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
    <div className="flex justify-between items-center w-full">
      <Heading title={`Timetable of Semester ${userData.semester}`} />
    </div>
    <div className="mt-5 ml-10">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timing</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(timetable[currentDay] || []).map(schedule => {
            const [start, end] = schedule.timing.split('-').map(t => new Date(`1970/01/01 ${t}`).getTime());
            const now = new Date(`1970/01/01 ${new Date().toTimeString().split(' ')[0]}`).getTime();
            const isCurrent = now >= start && now <= end;
            return (
              <tr key={schedule._id} className={isCurrent ? 'bg-green-200' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.timing}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.faculty}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.subject}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default Timetable;
