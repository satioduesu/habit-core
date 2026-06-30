const STORAGE_KEY = "habit-core-state-v1";

const state = {
  habits: [],
};

const habitForm = document.querySelector("#habitForm");
const habitInput = document.querySelector("#habitInput");
const habitList = document.querySelector("#habitList");
const emptyState = document.querySelector("#emptyState");
const rateValue = document.querySelector("#rateValue");
const completeCount = document.querySelector("#completeCount");
const bestStreak = document.querySelector("#bestStreak");
const habitCount = document.querySelector("#habitCount");
const todayLabel = document.querySelector("#todayLabel");

const dateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayKey = () => dateKey();

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.habits)) {
      state.habits = parsed.habits.map((habit) => ({
        id: String(habit.id),
        name: String(habit.name || "").trim(),
        createdAt: habit.createdAt || todayKey(),
        checks: habit.checks && typeof habit.checks === "object" ? habit.checks : {},
      })).filter((habit) => habit.name);
    }
  } catch {
    state.habits = [];
  }
};

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const streakForHabit = (habit) => {
  let streak = 0;
  let cursor = new Date();
  while (habit.checks[dateKey(cursor)]) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
};

const bestCurrentStreak = () => {
  return state.habits.reduce((best, habit) => Math.max(best, streakForHabit(habit)), 0);
};

const completedToday = () => {
  const key = todayKey();
  return state.habits.filter((habit) => habit.checks[key]).length;
};

const renderSummary = () => {
  const total = state.habits.length;
  const complete = completedToday();
  const rate = total === 0 ? 0 : Math.round((complete / total) * 100);

  rateValue.textContent = `${rate}%`;
  completeCount.textContent = `${complete} / ${total}`;
  bestStreak.textContent = `${bestCurrentStreak()}日`;
  habitCount.textContent = `${total}件`;
};

const renderHabits = () => {
  const key = todayKey();
  habitList.innerHTML = "";
  emptyState.classList.toggle("visible", state.habits.length === 0);

  for (const habit of state.habits) {
    const done = Boolean(habit.checks[key]);
    const item = document.createElement("li");
    item.className = `habit-item${done ? " done" : ""}`;

    const check = document.createElement("button");
    check.className = "check-button";
    check.type = "button";
    check.textContent = "✓";
    check.setAttribute("aria-label", `${habit.name}を今日チェック`);
    check.addEventListener("click", () => toggleToday(habit.id));

    const body = document.createElement("div");
    const name = document.createElement("div");
    name.className = "habit-name";
    name.textContent = habit.name;
    const meta = document.createElement("div");
    meta.className = "habit-meta";
    meta.textContent = `連続 ${streakForHabit(habit)}日`;
    body.append(name, meta);

    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `${habit.name}を削除`);
    remove.addEventListener("click", () => deleteHabit(habit.id));

    item.append(check, body, remove);
    habitList.append(item);
  }
};

const render = () => {
  todayLabel.textContent = new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
  renderSummary();
  renderHabits();
};

const addHabit = (name) => {
  state.habits.unshift({
    id: `${Date.now()}-${crypto.randomUUID ? crypto.randomUUID() : Math.random()}`,
    name,
    createdAt: todayKey(),
    checks: {},
  });
  saveState();
  render();
};

const deleteHabit = (id) => {
  state.habits = state.habits.filter((habit) => habit.id !== id);
  saveState();
  render();
};

const toggleToday = (id) => {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  const key = todayKey();
  if (habit.checks[key]) {
    delete habit.checks[key];
  } else {
    habit.checks[key] = true;
  }
  saveState();
  render();
};

habitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = habitInput.value.trim();
  if (!name) return;
  addHabit(name);
  habitInput.value = "";
  habitInput.focus();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

loadState();
render();
