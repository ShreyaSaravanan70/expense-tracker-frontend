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

            data.forEach((expense, index) => {
                const li = document.createElement("li");
                li.className = "expense-item";

                const text = document.createElement("span");
                text.textContent = `${expense.date} | ₹${expense.amount} | ${expense.description}`;

                const btn = document.createElement("button");
                btn.className = "delete-btn";
                btn.type = "button";
                btn.textContent = "🗑";

                btn.addEventListener("click", () => deleteExpense(index));

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
   DELETE EXPENSE
======================= */
function deleteExpense(index) {
    if (!confirm("Delete this expense?")) return;

    fetch(`${API}/delete/${index}`, {
        method: "POST"
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
   SAVE EXPENSE
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense)
    })
        .then(res => {
            if (!res.ok) throw new Error("Save failed");
            return res.json();
        })
        .then(() => {
            document.querySelector("form").reset();
            loadExpenses();
        })
        .catch(err => {
            console.error(err);
            alert("Failed to save expense");
        })
        .finally(() => saving = false);
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
    if (document.getElementById("list")) loadExpenses();

    const form = document.querySelector("form");
    if (form) form.addEventListener("submit", saveExpense);
});
