document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const messageBox = document.getElementById('messageBox');
    const resDateInput = document.getElementById('resDate');
    const tableSuggestionsContainer = document.getElementById('tableSuggestionsContainer');
    const tableOptionsDiv = document.getElementById('tableOptions');
    const resetBookingButton = document.getElementById('resetBookingButton');

    const bookingConfirmationModal = document.getElementById('bookingConfirmationModal');
    const modalMessage = document.getElementById('modalMessage');

    // Store current booking details for table selection
    let currentBookingDetails = {};

    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    resDateInput.min = `${yyyy}-${mm}-${dd}`;

    // Function to display general messages (errors, initial success before suggestions)
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800', 'bg-blue-100', 'text-blue-800');
        if (type === 'success') {
            messageBox.classList.add('bg-green-100', 'text-green-800');
        } else if (type === 'error') {
            messageBox.classList.add('bg-red-100', 'text-red-800');
        } else if (type === 'info') {
            messageBox.classList.add('bg-blue-100', 'text-blue-800');
        }
        // Hide after 5 seconds, unless it's a critical error
        if (type !== 'error') {
            setTimeout(() => {
                messageBox.classList.add('hidden');
            }, 5000);
        }
    }

    // Function to simulate fetching available tables
    function simulateAvailableTables(date, time, guests) {
        // In a real application, this would be an API call to your backend
        // For demonstration, we'll return some dummy data based on inputs
        const availableTables = [];
        const numGuests = parseInt(guests);

        // Simple logic to suggest tables based on guests
        if (numGuests <= 2) {
            availableTables.push({ id: 'A1', capacity: 2, location: 'Window Side', description: 'Cozy table for two with a view.' });
            availableTables.push({ id: 'A2', capacity: 2, location: 'Bar Area', description: 'Lively spot near the bar.' });
        } else if (numGuests <= 4) {
            availableTables.push({ id: 'B1', capacity: 4, location: 'Main Dining', description: 'Standard table in the main area.' });
            availableTables.push({ id: 'B2', capacity: 4, location: 'Patio', description: 'Outdoor seating (weather permitting).' });
        } else if (numGuests <= 6) {
            availableTables.push({ id: 'C1', capacity: 6, location: 'Private Nook', description: 'Secluded spot for a small group.' });
        } else {
            // For larger groups, less specific tables
            availableTables.push({ id: 'D1', capacity: 8, location: 'Large Booth', description: 'Spacious booth for a group.' });
            availableTables.push({ id: 'D2', capacity: 10, location: 'Celebration Zone', description: 'Perfect for events.' });
        }

        // Add some random availability if needed
        if (Math.random() > 0.8) { // 20% chance of no tables
            return [];
        }

        return availableTables;
    }

    // Function to display table suggestions
    function displayTableSuggestions(tables) {
        tableOptionsDiv.innerHTML = ''; // Clear previous suggestions
        tableSuggestionsContainer.classList.remove('hidden');
        bookingForm.classList.add('hidden'); // Hide the booking form

        if (tables.length === 0) {
            tableOptionsDiv.innerHTML = '<p class="text-center text-gray-600">No tables available for the selected criteria. Please try different options.</p>';
            showMessage('No tables found. Please try different date/time/guests.', 'info');
            return;
        }

        tables.forEach(table => {
            const tableCard = document.createElement('div');
            tableCard.classList.add('bg-yellow-50', 'p-4', 'rounded-md', 'shadow-sm', 'border', 'border-yellow-200', 'flex', 'flex-col', 'items-center', 'justify-between', 'transform', 'hover:scale-105', 'transition-all', 'duration-200');

            tableCard.innerHTML = `
                <h3 class="text-xl font-semibold text-yellow-700 mb-2">Table ${table.id}</h3>
                <p class="text-gray-700 mb-1">Capacity: ${table.capacity} guests</p>
                <p class="text-gray-600 text-sm mb-3">${table.location}</p>
                <p class="text-gray-500 text-xs text-center mb-4">${table.description}</p>
                <button data-table-id="${table.id}"
                        class="select-table-btn w-full py-2 px-4 rounded-md bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition duration-150 ease-in-out">
                    Select This Table
                </button>
            `;
            tableOptionsDiv.appendChild(tableCard);
        });

        // Add event listeners to the new 'Select This Table' buttons
        document.querySelectorAll('.select-table-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const tableId = event.target.dataset.tableId;
                // Find the selected table details from the original tables array
                const selectedTable = tables.find(t => t.id === tableId);
                handleTableSelection(selectedTable);
            });
        });
        showMessage('Please choose one of the available tables below.', 'info');
    }

    // Function to handle table selection and show confirmation modal
    function handleTableSelection(selectedTable) {
        tableSuggestionsContainer.classList.add('hidden'); // Hide suggestions
        showMessage('Booking in progress...', 'info'); // Provide feedback

        // Simulate final booking process (e.g., API call to confirm table reservation)
        setTimeout(() => {
            const finalMessage = `
                Your booking for ${currentBookingDetails.guests} guests
                on ${currentBookingDetails.date} at ${currentBookingDetails.time}
                is confirmed for Table ${selectedTable.id} (${selectedTable.location}).
                ${currentBookingDetails.occasion ? `Occasion: ${currentBookingDetails.occasion}.` : ''}
            `;
            modalMessage.innerHTML = finalMessage;
            showModal(); // Display the confirmation modal
            bookingForm.reset(); // Reset the original form
            messageBox.classList.add('hidden'); // Hide general message box
        }, 1500); // Simulate network delay
    }

    // Functions for the modal (show and hide)
    function showModal() {
        bookingConfirmationModal.classList.remove('hidden');
        // Add a class for the animation
        bookingConfirmationModal.querySelector('.modal-content').classList.add('show');
    }

    // This function needs to be globally accessible for the onclick in HTML
    window.closeModal = function() {
        bookingConfirmationModal.querySelector('.modal-content').classList.remove('show');
        setTimeout(() => {
            bookingConfirmationModal.classList.add('hidden');
        }, 300); // Allow time for fade-out animation
    };

    // Event listener for form submission (Find a Table)
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const resDate = resDateInput.value;
        const resTime = document.getElementById('resTime').value;
        const guests = document.getElementById('guests').value;
        const occasion = document.getElementById('occasion').value;

        // Simple validation
        if (!resDate || !resTime || !guests) {
            showMessage('Please fill in all required fields (Date, Time, Number of Guests).', 'error');
            return;
        }

        if (parseInt(guests) < 1 || parseInt(guests) > 10) {
            showMessage('Number of guests must be between 1 and 10.', 'error');
            return;
        }

        // Store details for later use when selecting a specific table
        currentBookingDetails = {
            date: resDate,
            time: resTime,
            guests: guests,
            occasion: occasion || 'Not specified'
        };

        // Simulate finding tables and display them
        const foundTables = simulateAvailableTables(resDate, resTime, guests);
        displayTableSuggestions(foundTables);
    });

    // Event listener for the "Start New Search" button
    resetBookingButton.addEventListener('click', () => {
        tableSuggestionsContainer.classList.add('hidden');
        bookingForm.classList.remove('hidden'); // Show the booking form again
        messageBox.classList.add('hidden'); // Hide any messages
        bookingForm.reset(); // Clear the form
    });
});
