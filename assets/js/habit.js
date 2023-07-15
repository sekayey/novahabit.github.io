// Sample habit data
let habits = [
    { name: "", time: "", days: [false, false, false, false, false, false, false], note: ""}
    // Add more habits as needed
  ];
  let progress = [];
  let showDayIdx = 0; // Change Streak Days
  
  // Function to generate the habit table
  function generateHabitTable() {
    const habitTableBody = document.querySelector("#habitTable tbody");
  
    // Clear existing table rows
    habitTableBody.innerHTML = "";
  
    habits.forEach((habit, index) => {
      const row = createHabitRow(habit, index);
      habitTableBody.appendChild(row);
    });
    GenerateNotesTable();
  }

  // Function to create a new habit row
  function createHabitRow(habit, index) {
    const row = document.createElement("tr");
    row.id = `habit-${index}`;
    row.classList.add("habit-row");
  
    const nameCell = document.createElement("td");
    nameCell.contentEditable = true;
    nameCell.myparams = index;
    nameCell.oninput = changeHabitName;
    nameCell.innerText = habit.name;
    row.appendChild(nameCell);
  
    const timeCell = document.createElement("td");
    timeCell.contentEditable = true;
    timeCell.myparams = index;
    timeCell.oninput = changeHabitTime;
    timeCell.innerText = habit.time;
    row.appendChild(timeCell);
  
    habit.days.forEach((day, dayIndex) => {
      const dayCell = document.createElement("td");
      const checkboxBtn = document.createElement("button");
      checkboxBtn.className = "checklist-button";
      checkboxBtn.innerText = day ? "✔" : "-";
      checkboxBtn.addEventListener("click", () => toggleDay(index, dayIndex));
      dayCell.appendChild(checkboxBtn);
      row.appendChild(dayCell);
    });
  
    const progressCell = document.createElement("td");
    progressCell.innerText = calculateProgress(habit.days) + "%";
    row.appendChild(progressCell);
  
    return row;
  }

  function changeHabitName(evt){
    //env.target.myparams is custom param used to store habit index on document
    habits[evt.target.myparams].name = evt.target.innerText;
    GenerateNotesTable();
  }
  function changeHabitTime(evt){
    //env.target.myparams is custom param used to store habit index on document
    habits[evt.target.myparams].time = evt.target.innerText;
    GenerateNotesTable();
  }
  function changeNote(evt){
    //env.target.myparams is custom param used to store habit index on document
    habits[evt.target.myparams].note = evt.target.innerText;
  }

  // Note Table
  function GenerateNotesTable(){

    const habitNoteBody = document.querySelector("#noteTable tbody");
    const habitTableBody = document.querySelector("#habitTable tbody");
    //clear note table body
    habitNoteBody.innerHTML = "";

    //loop through every habits
    habits.forEach((habit, index) => {
      const row = document.createElement("tr");
      
      //create name cell and assign habit name
      const nameCell = document.createElement("td");
      nameCell.innerText = habit.name;
      row.appendChild(nameCell);
    
      //create time cell and assign habit time
      const timeCell = document.createElement("td");
      timeCell.innerText = habit.time;
      row.appendChild(timeCell);
      
      //create note cell and assign text, also detect input and change habit's note based on new value
      const noteCell = document.createElement("td");
      noteCell.contentEditable = true;
      noteCell.oninput = changeNote;
      noteCell.myparams = index;
      noteCell.innerText = habit.note;
      row.appendChild(noteCell);
    
      habitNoteBody.appendChild(row);
    });
  }

  // Function to toggle a day on/off
  function toggleDay(habitIndex, dayIndex) {
    const habit = habits[habitIndex];
    const isChecked = habit.days[dayIndex];
    habit.days[dayIndex] = !isChecked;
  
    const row = document.getElementById(`habit-${habitIndex}`);
    const checkboxBtn = row.cells[2 + dayIndex].firstChild;
  
    if (habit.days[dayIndex]) {
      checkboxBtn.textContent = "✔";
    } else {
      checkboxBtn.textContent = "-";
    }
  
    const progressCell = row.cells[9];
    progressCell.textContent = calculateProgress(habit.days) + "%";
    
    // Change Days
    calculateStreak(showDayIdx);
    calculateAverageProgress();
    calculateCompletedDays();
  }
  
  // Function to calculate the progress percentage
  function calculateProgress(days) {
    const completedDays = days.filter(day => day).length;
    return Math.round((completedDays / days.length) * 100);
  }
  function calculateAverageProgress(){

    
    progress = [];
    habits.forEach((habit) => {
      progress.push(calculateProgress(habit.days));
    });
    let avg = 0;

    progress.forEach(p => {
        avg += p;
    });
    avg = avg / progress.length;
    
    const avgText = document.querySelector("#avgProgressValue");
    avgText.textContent = `${Math.round(avg * 100) / 100}%`;

  }
  function calculateStreak(day){
      let streak = 0;
      habits.forEach((habit) => {
        if(habit.days[day]){
          streak+=1;
        }
      });
      
      
    const streakText = document.querySelector("#streakValue");
    streakText.textContent = `${streak}`;
  }
  function calculateCompletedDays(){
    
    let completedDays = 0;

    for (let i = 0; i < 7; i++) {
      let completed = true;
      habits.forEach((habit) => {
        if(!habit.days[i]){
          completed = false;
        }
      });
      if(completed){
        completedDays+=1;
      }
    }
    const completedText = document.querySelector("#completedValue");
    completedText.textContent = `${completedDays} days`;
    const failedText = document.querySelector("#failedValue");
    failedText.textContent = `${7 - completedDays} days`;
  }

  // function to calculate daily progress
  
  // Function to add a new habit
  function addHabit() {
    const habitName = prompt("Enter habit name:");
    if (habitName) {
      const newHabit = { name: habitName, time: "", days: [false, false, false, false, false, false, false], note:"" };
      habits.push(newHabit);
      generateHabitTable();
      calculateStreak(showDayIdx);
      calculateCompletedDays();
      calculateAverageProgress();
    }
  }
  
  // Function to add a new row dynamically
  function addRow() {
    const habitTableBody = document.querySelector("#habitTable tbody");
    // habitTableBody.deleteRow(habits.length);
    let habit = { name: "", time: "", days: [false, false, false, false, false, false, false], note:"" };
    const newRow = createHabitRow(habit, habits.length);
    habitTableBody.appendChild(newRow);
    habits.push(habit);
    
    GenerateNotesTable();
    // const rowPer = createHabitPercentageRow();
    // habitTableBody.appendChild(rowPer);
  }
  
  // Generate the habit table when the page loads
  window.onload = function() {
    generateHabitTable();
    const addRowBtn = document.getElementById("addRowBtn");
    addRowBtn.addEventListener("click", addRow);
    calculateStreak(showDayIdx);
    calculateCompletedDays();
    calculateAverageProgress();
  };