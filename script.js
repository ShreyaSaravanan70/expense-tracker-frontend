// 🔗 Render backend URL
const API = "https://expense-tracker-backend-7jqc.onrender.com/expenses";

let saving = false;

/* =======================
   LOAD EXPENSES
======================= */
function loadExpenses() {
    const list = document.getElementById("list");
    if (!list) return;

    list.innerHTML = "<li>Loading...</li>";

    fetch(API)
        .then(res => res.json())
        .then(data => {
            list.innerHTML = "";

            if (!data || data.length === 0) {
                list.innerHTML = `<li class="empty-state">No expenses yet.</li>`;
                return;
            }

            data.forEach(expense => {
                const li = document.createElement("li");
                li.className = "expense-item";

                const text = document.createElement("span");
                text.textContent = `${expense.date} | ₹${expense.amount} | ${expense.description}`;

                const btn = document.createElement("button");
                btn.className = "delete-btn";
                btn.type = "button";
                btn.textContent = "🗑";

                // ✅ DELETE USING MONGODB _id
                btn.addEventListener("click", () => deleteExpense(expense._id));

                li.appendChild(text);
                li.appendChild(btn);
                list.appendChild(li);
            });
        })
        .catch(err => {
            console.error(err);
            list.innerHTML = `<li class="empty-state">Error loading expenses</li>`;
        });
}

/* =======================
   SAVE EXPENSE (MongoDB)
======================= */
function saveExpense(e) {
    e.preventDefault();
    if (saving) return;
    saving = true;

    const date = document.getElementById("date").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value.trim();

    if (!date || isNaN(amount) || amount <= 0 || !description) {
        alert("Please fill all fields correctly");
        saving = false;
        return;
    }

    const expense = { date, amount, description };

    fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
    })
        .then(res => {
            if (!res.ok) throw new Error("Save failed");
            return res.json();
        })
        .then(() => {
            document.querySelector("form").reset();
            loadExpenses();
            alert("Expense saved successfully ✅");
        })
        .catch(err => {
            console.error(err);
            alert("Failed to save expense");
        })
        .finally(() => saving = false);
}

/* =======================
   DELETE EXPENSE (MongoDB)
======================= */
function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;

    fetch(`${API}/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            return res.json();
        })
        .then(() => loadExpenses())
        .catch(err => {
            console.error(err);
            alert("Failed to delete expense");
        });
}

/* =======================
   TOGGLE EXPENSE LIST
======================= */
function toggleExpenses() {
    const list = document.getElementById("list");
    if (!list) return;

    list.classList.toggle("hidden");

    if (!list.classList.contains("hidden")) {
        loadExpenses();
    }
}

/* =======================
   EVENT LISTENERS
======================= */
document.addEventListener("DOMContentLoaded", () => {
    loadExpenses();

    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", saveExpense);
    }
});
