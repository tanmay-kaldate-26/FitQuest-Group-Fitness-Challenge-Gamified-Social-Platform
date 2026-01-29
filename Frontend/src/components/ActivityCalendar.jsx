import React, { useState } from "react";
import "./ActivityCalendar.css";

const ActivityCalendar = ({ data }) => {
  // 1. Get current date info
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // 2. Helper to get days in a month
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon

  // 3. Generate Calendar Grid
  const renderCalendarDays = () => {
    const totalDays = getDaysInMonth(currentMonth, currentYear);
    const startDay = getFirstDayOfMonth(currentMonth, currentYear);
    
    const daysArray = [];

    // Empty slots for days before the 1st of the month
    for (let i = 0; i < startDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Actual Days
    for (let day = 1; day <= totalDays; day++) {
      // Format date string to match backend (YYYY-MM-DD)
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Find if we have data for this day
      const dayData = data.find(d => d.date === dateString);
      const isCheckedIn = dayData && dayData.checkedIn;
      const points = dayData ? dayData.totalPoints : 0;

      let dayClass = "calendar-day";
      if (isCheckedIn) dayClass += " active";
      // Highlight today
      if (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      ) {
        dayClass += " today";
      }

      daysArray.push(
        <div key={day} className={dayClass} title={points > 0 ? `${points} pts` : "No Activity"}>
          <span className="day-number">{day}</span>
          {points > 0 && <span className="day-points">+{points}</span>}
        </div>
      );
    }

    return daysArray;
  };

  // 4. Month Navigation
  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="month-calendar-wrapper">
      <div className="month-header">
        <button onClick={() => changeMonth(-1)}>←</button>
        <h3>{monthNames[currentMonth]} {currentYear}</h3>
        <button onClick={() => changeMonth(1)}>→</button>
      </div>

      <div className="weekdays-row">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      <div className="days-grid">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default ActivityCalendar;