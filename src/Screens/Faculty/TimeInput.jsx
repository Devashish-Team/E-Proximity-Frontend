import React, { useState } from 'react';

const TimeInput = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  };

  const handleMinuteChange = (event) => {
    setSelectedMinute(event.target.value);
  };

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const handleDoneClick = () => {
    const hour = parseInt(selectedHour, 10);
    const minute = parseInt(selectedMinute, 10);
    if ((hour >= 1 && hour <= 12) && (minute >= 0 && minute <= 59)) {
      onChange(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
      setShowPicker(false);
    } else {
      alert('Please enter a valid time.');
    }
  };

  return (
    <div className="flex flex-col">
      <label className="mb-2">{label}</label>
      <input type="text" className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" value={value} onFocus={() => setShowPicker(true)} readOnly />
      {showPicker && (
        <div className="flex space-x-2 mt-2">
          <input type="number" min="1" max="12" className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" value={selectedHour} onChange={handleHourChange} />
          <input type="number" min="0" max="59" className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" value={selectedMinute} onChange={handleMinuteChange} />
          <select className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" value={selectedPeriod} onChange={handlePeriodChange}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
          <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleDoneClick}>Done</button>
        </div>
      )}
    </div>
  );
};

export default TimeInput;