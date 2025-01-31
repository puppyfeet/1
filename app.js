document.getElementById('saveButton').addEventListener('click', function() {
    const expense = document.getElementById('expenseInput').value;
    const description = document.getElementById('descriptionInput').value;
    const date = document.getElementById('dateInput').value;
    const category = document.getElementById('categoryInput').value || 'Unspecified';
    
    // Get selected mode from input field
    const mode = document.getElementById('customModeInput').value.trim() || 'Cash'; // Default to Cash if no custom input

    const remarks = document.getElementById('remarksInput').value;

    if (expense && description && date) {
        let savedValues = JSON.parse(localStorage.getItem('savedValues')) || [];
        savedValues.push({ expense: parseFloat(expense), description, date, category, mode, remarks });
        localStorage.setItem('savedValues', JSON.stringify(savedValues));
        
        displaySavedValues();
        
        // Clear inputs
        document.getElementById('expenseInput').value = '';
        document.getElementById('descriptionInput').value = '';
        document.getElementById('dateInput').value = new Date().toISOString().split('T')[0]; // Reset to today's date
        document.getElementById('categoryInput').value = '';
        
        // Clear custom mode input
        document.getElementById('customModeInput').value = '';
        
        document.getElementById('remarksInput').value = '';
    }
});

// Handle numeric keypad input
const keypadButtons = document.querySelectorAll('.keypad-button');
const expenseInput = document.getElementById('expenseInput');

keypadButtons.forEach(button => {
    button.addEventListener('click', function() {
        const value = this.dataset.value; // Get the value from data attribute
        
        if (value === 'C') { // Clear button
            expenseInput.value = ''; // Clear the input field
        } else { // Number and decimal buttons
            expenseInput.value += value; // Append value to the input field
        }
        
        expenseInput.focus(); // Keep focus on the input field
    });
});

// Category button event listeners
document.getElementById('lunchButton').addEventListener('click', function() {
    document.getElementById('categoryInput').value = 'Lunch';
});

document.getElementById('dinnerButton').addEventListener('click', function() {
    document.getElementById('categoryInput').value = 'Dinner';
});

// Mode button event listeners
document.querySelectorAll('.mode-buttons button').forEach(button => {
    button.addEventListener('click', function() {
        // Set the selected mode in the custom mode input field
        document.getElementById('customModeInput').value = this.textContent;

        // Clear any selected class from other buttons
        document.querySelectorAll('.mode-buttons button').forEach(btn => btn.classList.remove('selected'));
        
        // Add selected class to the clicked button
        this.classList.add('selected');
        
        console.log("Selected Mode:", this.textContent); // For debugging purposes
    });
});

// Initialize default selected mode
document.getElementById('cashButton').classList.add('selected');
document.getElementById('customModeInput').value = 'Cash'; // Set default value in custom input

function displaySavedValues() {
   const savedValues = JSON.parse(localStorage.getItem('savedValues')) || [];
   
   const savedValuesContainer = document.getElementById('savedValues');
   savedValuesContainer.innerHTML = ''; // Clear previous entries

   let totalExpenses = 0; // Initialize total expenses

   savedValues.forEach((item, index) => {
       const row = `
           <tr>
               <td>${item.expense.toFixed(2)}</td> <!-- Format expense to 2 decimal places -->
               <td>${item.description}</td>
               <td>${item.date}</td>
               <td>${item.category}</td>
               <td>${item.mode}</td>
               <td>${item.remarks}</td>
               <td><button onclick="deleteRecord(${index})">Delete</button></td>
           </tr>`;
       
       savedValuesContainer.innerHTML += row; // Append new row to the table body
       
       totalExpenses += item.expense; // Add to total expenses
   });

   // Update the existing total expenses header
   const totalExpensesHeader = document.getElementById("totalExpensesHeader");
   totalExpensesHeader.textContent = `Total Expenses: $${totalExpenses.toFixed(2)}`;
}

// Function to delete a record
function deleteRecord(index) {
   let savedValues = JSON.parse(localStorage.getItem('savedValues')) || [];
   
   // Remove the record at the specified index
   savedValues.splice(index, 1);
   
   // Update local storage and refresh displayed values
   localStorage.setItem('savedValues', JSON.stringify(savedValues));
   displaySavedValues();
}

// Function to delete all records
document.getElementById('deleteAllButton').addEventListener('click', function() {
    localStorage.removeItem('savedValues'); // Remove all records from local storage
    displaySavedValues(); // Refresh displayed values
});

// Display saved values on load
displaySavedValues();
