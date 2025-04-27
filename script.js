// Custom Popup Functions
function showAlert(message) {
    document.getElementById("popup-message").innerText = message;
    const buttonsDiv = document.getElementById("popup-buttons");
    buttonsDiv.innerHTML = "";
    const okBtn = document.createElement("button");
    okBtn.innerText = "OK";
    okBtn.onclick = closePopup;
    buttonsDiv.appendChild(okBtn);
    document.getElementById("popup-overlay").style.display = "flex";
}

let confirmCallback = null;
function showConfirm(message, callback) {
    confirmCallback = callback;
    document.getElementById("popup-message").innerText = message;
    const buttonsDiv = document.getElementById("popup-buttons");
    buttonsDiv.innerHTML = "";
    const yesBtn = document.createElement("button");
    yesBtn.innerText = "Yes";
    yesBtn.onclick = function () {
        closePopup();
        if (confirmCallback) {
            confirmCallback(true);
        }
        confirmCallback = null;
    };
    const noBtn = document.createElement("button");
    noBtn.innerText = "No";
    noBtn.onclick = function () {
        closePopup();
        if (confirmCallback) {
            confirmCallback(false);
        }
        confirmCallback = null;
    };
    buttonsDiv.appendChild(yesBtn);
    buttonsDiv.appendChild(noBtn);
    document.getElementById("popup-overlay").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup-overlay").style.display = "none";
}

// Global variables to simulate a user's account and user database
let currentUser = null;
let accountBalance = 0;
let transactions = [];
// In-memory user database with a dummy user pre-loaded.
const users = [{ username: "user", password: "password", name: "John Doe" }];

// Utility function to add a transaction entry
function addTransaction(type, amount, description) {
    const transaction = {
        date: new Date().toLocaleString(),
        type: type,
        description: description,
        amount: amount.toFixed(2)
    };
    transactions.push(transaction);
    updateTransactionTable();
}

// Update transaction history table
function updateTransactionTable() {
    const tbody = document.querySelector("#transaction-table tbody");
    tbody.innerHTML = "";
    transactions.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${tx.date}</td>
                         <td>${tx.type}</td>
                         <td>${tx.description}</td>
                         <td>$${tx.amount}</td>`;
        tbody.appendChild(row);
    });
}

// Update balance display
function updateBalanceDisplay() {
    document.getElementById("balance-display").innerText = accountBalance.toFixed(2);
}

// Show the specified section in the dashboard
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");
    if (sectionId === "home") {
        updateBalanceDisplay();
    }
}

// Toggle between login and signup containers
function toggleContainers(view) {
    if (view === "signup") {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("signup-container").style.display = "block";
    } else {
        document.getElementById("signup-container").style.display = "none";
        document.getElementById("login-container").style.display = "block";
    }
}

// Handle signup form submission
document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signup-name").value.trim();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!name || !username || !password) {
        showAlert("Please fill in all fields.");
        return;
    }

    // Invalid email regex (incorrect)
    console.log("Validating email:", username);
    const emailRegex = /^[^@]+$/;
    if (!emailRegex.test(username)) {
        console.error("Invalid email format in username: " + username); // Logs the error from script.js
        showAlert("Please enter a valid email as the username.");
        return;
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        showAlert("Username already exists. Please choose a different one.");
        return;
    }

    // Add new user to the users array
    users.push({ name, username, password });
    showAlert("Registration successful! Please login with your new credentials.");
    // Clear signup fields and switch back to login
    document.getElementById("signup-form").reset();
    toggleContainers("login");
});

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    // Find matching user
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        document.getElementById("user-display").innerText = currentUser.name;
        document.getElementById("login-container").style.display = "none";
        document.getElementById("signup-container").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        updateBalanceDisplay();
    } else {
        showAlert("Invalid credentials. Please try again.");
    }
});

// Deposit money
function depositMoney() {
    const amountInput = document.getElementById("deposit-amount");
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        showAlert("Please enter a valid amount.");
        return;
    }
    accountBalance += amount;
    addTransaction("Deposit", amount, "Deposit to account");
    updateBalanceDisplay();
    showAlert(`Deposited $${amount.toFixed(2)} successfully.`);
    amountInput.value = "";
    showSection("home");
}

// Withdraw money
function withdrawMoney() {
    const amountInput = document.getElementById("withdraw-amount");
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        showAlert("Please enter a valid amount.");
        return;
    }
    if (amount > accountBalance) {
        showAlert("Insufficient funds.");
        return;
    }
    accountBalance -= amount;
    addTransaction("Withdrawal", amount, "Withdrawal from account");
    updateBalanceDisplay();
    showAlert(`Withdrew $${amount.toFixed(2)} successfully.`);
    amountInput.value = "";
    showSection("home");
}

// Transfer money
function transferMoney() {
    const recipient = document.getElementById("transfer-recipient").value.trim();
    const amountInput = document.getElementById("transfer-amount");
    const amount = parseFloat(amountInput.value);
    if (recipient === "" || isNaN(amount) || amount <= 0) {
        showAlert("Please enter a valid recipient and amount.");
        return;
    }
    if (amount > accountBalance) {
        showAlert("Insufficient funds.");
        return;
    }
    accountBalance -= amount;
    addTransaction("Transfer", amount, `Transfer to ${recipient}`);
    updateBalanceDisplay();
    showAlert(`Transferred $${amount.toFixed(2)} to ${recipient} successfully.`);
    document.getElementById("transfer-recipient").value = "";
    amountInput.value = "";
    showSection("home");
}

// Request loan (simulate by adding the amount to the account)
function requestLoan() {
    const amountInput = document.getElementById("loan-amount");
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        showAlert("Please enter a valid loan amount.");
        return;
    }
    accountBalance += amount;
    addTransaction("Loan", amount, "Loan credited to account");
    updateBalanceDisplay();
    showAlert(`Loan of $${amount.toFixed(2)} approved and credited to your account.`);
    amountInput.value = "";
    showSection("home");
}

// Pay bill (simulate bill payment as a withdrawal)
function payBill() {
    const payee = document.getElementById("bill-payee").value.trim();
    const amountInput = document.getElementById("bill-amount");
    const amount = parseFloat(amountInput.value);
    if (payee === "" || isNaN(amount) || amount <= 0) {
        showAlert("Please enter a valid bill payee and amount.");
        return;
    }
    if (amount > accountBalance) {
        showAlert("Insufficient funds.");
        return;
    }
    accountBalance -= amount;
    addTransaction("Bill Payment", amount, `Bill payment to ${payee}`);
    updateBalanceDisplay();
    showAlert(`Bill of $${amount.toFixed(2)} paid to ${payee} successfully.`);
    document.getElementById("bill-payee").value = "";
    amountInput.value = "";
    showSection("home");
}

// Logout function (uses custom confirm popup)
function logout() {
    showConfirm("Are you sure you want to logout?", function (confirmed) {
        if (confirmed) {
            currentUser = null;
            accountBalance = 0;
            transactions = [];
            document.getElementById("dashboard").style.display = "none";
            document.getElementById("login-container").style.display = "block";
            document.getElementById("login-form").reset();
        }
    });
}
