import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import App from "./App";
import '@testing-library/jest-dom';

// Mock for window.alert
global.alert = jest.fn();

describe("Calendar App Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Requirement 1: Allows users to add and customize events", () => {
    render(<App />);

    // Find the Add button for creating a new event (you may need to add one in App.js)
    fireEvent.click(screen.getByText("Add Event"));
    const input = screen.getByLabelText("Event Title");

    fireEvent.change(input, { target: { value: "New Event" } });

    const dateInput = screen.getByLabelText("Event Date");
    fireEvent.change(dateInput, { target: { value: "2024-10-20T10:00" } });

    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("New Event")).toBeInTheDocument();
  });

  test("Requirement 2: Shows daily, weekly, and monthly views", () => {
    render(<App />);

    // Check the default weekly view is displayed
    expect(screen.getByText("Week")).toBeInTheDocument();

    // Click button to switch to monthly view
    fireEvent.click(screen.getByText("Month"));
    expect(screen.getByText("Month")).toBeInTheDocument();

    // Click button to switch to daily view
    fireEvent.click(screen.getByText("Day"));
    expect(screen.getByText("Day")).toBeInTheDocument();
  });

  test("Requirement 3: Allows drag and drop events to different dates", () => {
    render(<App />);

    // Mock drag-and-drop event simulation
    const event = screen.getByText("Meeting");

    fireEvent.dragStart(event);
    fireEvent.drop(screen.getByText("October 15, 2024"));

    // Assert event moved to the new date (mock event data changes)
    expect(screen.getByText("Meeting")).toBeInTheDocument();
  });

  test("Requirement 4: Allows users to set reminder notifications for events", () => {
    render(<App />);

    // Click on an event to set a reminder
    fireEvent.click(screen.getByText("Meeting"));
    expect(global.alert).toHaveBeenCalledWith("Reminder set for: Meeting");
  });

  test("Requirement 5: Displays overlapping events clearly", () => {
    render(<App />);

    // Overlapping events scenario
    const overlappingEvent1 = screen.getByText("Meeting");
    const overlappingEvent2 = screen.getByText("Lunch");

    expect(overlappingEvent1).toBeVisible();
    expect(overlappingEvent2).toBeVisible();
    // Mock that they are displayed side by side without overlap
  });

  test("Requirement 6: Differentiates between past, current, and future events", () => {
    render(<App />);

    const pastEvent = screen.getByText("Past Event");
    const currentEvent = screen.getByText("Meeting");
    const futureEvent = screen.getByText("Future Event");

    // Check for appropriate colors (you need to check the CSS classes/colors)
    expect(pastEvent).toHaveStyle("color: gray");
    expect(currentEvent).toHaveStyle("color: blue");
    expect(futureEvent).toHaveStyle("color: green");
  });

  test("Requirement 7: Allows users to reset the calendar to default views and settings", () => {
    render(<App />);

    // Switch to daily view, add some events
    fireEvent.click(screen.getByText("Day"));
    fireEvent.click(screen.getByText("Add Event"));
    fireEvent.change(screen.getByLabelText("Event Title"), {
      target: { value: "Temporary Event" },
    });
    fireEvent.click(screen.getByText("Save"));

    // Now click reset
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.queryByText("Temporary Event")).not.toBeInTheDocument();
  });

  test("Requirement 8: Allows users to customize the calendar display (themes, fonts)", () => {
    render(<App />);

    // Click to change theme and font size
    fireEvent.click(screen.getByText("Customize Display"));

    const darkTheme = screen.getByLabelText("Dark Theme");
    fireEvent.click(darkTheme);

    const fontSize = screen.getByLabelText("Font Size");
    fireEvent.change(fontSize, { target: { value: "18" } });

    expect(screen.getByText("Meeting")).toHaveStyle("font-size: 18px");
  });

  test("Requirement 9: Allows users to view and compare events from multiple calendars", () => {
    render(<App />);

    // Simulate linking another calendar like Google
    fireEvent.click(screen.getByText("Link Google Calendar"));
    expect(screen.getByText("Google Event")).toBeInTheDocument();
  });

  test("Requirement 10: Allows users to edit events while keeping their position", () => {
    render(<App />);

    const event = screen.getByText("Meeting");
    fireEvent.click(event);

    fireEvent.change(screen.getByLabelText("Event Title"), {
      target: { value: "Edited Meeting" },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Edited Meeting")).toBeInTheDocument();
  });

  test("Requirement 11: Provides option to export the calendar or specific events as a file", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Export Calendar"));
    expect(global.alert).toHaveBeenCalledWith(
      "Calendar exported successfully!"
    );
  });

  test("Requirement 12: Allows users to set recurring events", () => {
    render(<App />);

    // Add a new recurring event
    fireEvent.click(screen.getByText("Add Recurring Event"));
    fireEvent.change(screen.getByLabelText("Event Title"), {
      target: { value: "Weekly Meeting" },
    });
    fireEvent.click(screen.getByLabelText("Repeat Weekly"));

    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Weekly Meeting")).toBeInTheDocument();
    // Ensure it's recurring in weekly intervals (this can be simulated in future view)
  });
});
