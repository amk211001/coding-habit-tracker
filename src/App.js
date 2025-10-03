import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

// Initial habits with category field
const initialHabits = [
  {
    id: 1,
    name: "Daily Coding Practice",
    description: "Practice coding for at least 30 minutes",
    category: "Coding",
    completions: [],
  },
  {
    id: 2,
    name: "Read Programming Articles",
    description: "Read technical articles or documentation",
    category: "Learning",
    completions: [],
  },
  {
    id: 3,
    name: "Exercise",
    description: "Physical exercise for 30 minutes",
    category: "General",
    completions: [],
  },
];

function App() {
  // State for habits list
  const [habits, setHabits] = useState(initialHabits);

  // State for new habit form
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "General", 
  });

  // Function to add a new habit with category validation
  const addHabit = () => {
    // Validate category is non-empty string
    if (
      !newHabit.category ||
      typeof newHabit.category !== "string" ||
      newHabit.category.trim() === ""
    ) {
      console.error("Category must be a non-empty string");
      return;
    }

    // Validate other required fields
    if (!newHabit.name.trim()) {
      console.error("Habit name is required");
      return;
    }

    const habit = {
      id: Date.now(), // Simple ID generation
      name: newHabit.name.trim(),
      description: newHabit.description.trim(),
      category: newHabit.category.trim(),

      completions: [],
    };

    setHabits((prevHabits) => [...prevHabits, habit]);

    // Reset form
    setNewHabit({
      name: "",
      description: "",
      category: "General",
    });

    // Console log for testing purposes
    console.log("New habit added:", habit);
    console.log("Updated habits list:", [...habits, habit]);
  };

  // Console log current state for testing
  console.log("Current habits:", habits);
  console.log("New habit form state:", newHabit);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Coding Habit Tracker - Data Model Updated with Categories</p>
        {/* <p>
          Check the browser console to see the habit data structure with
          categories.
        </p> */}
      </header>
    </div>
  );
}

export default App;
