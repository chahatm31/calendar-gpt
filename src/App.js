import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./App.css";

// Helper functions for drag and drop
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";

// React-Big-Calendar uses moment.js to handle date localization
const localizer = momentLocalizer(moment);

function App() {
  // State for events and reminders
  const [events, setEvents] = useState([
    {
      title: "Meeting",
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 1)),
      allDay: false,
    },
    {
      title: "Lunch",
      start: new Date(new Date().setHours(new Date().getHours() + 2)),
      end: new Date(new Date().setHours(new Date().getHours() + 3)),
      allDay: false,
    },
  ]);

  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter event title:");
    if (title) {
      setEvents((prevEvents) => [
        ...prevEvents,
        { title, start, end, allDay: false },
      ]);
    }
  };

  const moveEvent = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    const nextEvents = events.map((existingEvent) =>
      existingEvent.title === event.title ? updatedEvent : existingEvent
    );
    setEvents(nextEvents);
  };

  const handleEventDrop = ({ event, start, end }) => {
    moveEvent({ event, start, end });
  };

  // Reminder notifications (this can be further customized using external libraries)
  const setReminder = (event) => {
    alert(`Reminder set for: ${event.title}`);
  };

  return (
    <div className="App">
      <h1>Schedule Manager</h1>

      <DndProvider backend={HTML5Backend}>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          defaultView="week"
          views={["day", "week", "month"]}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onSelectEvent={(event) => setReminder(event)}
          draggableAccessor={(event) => true} // Makes events draggable
        />
      </DndProvider>
    </div>
  );
}

export default App;
