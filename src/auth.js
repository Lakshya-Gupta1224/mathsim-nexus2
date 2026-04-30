// auth.js — localStorage-based user management

export const getUsers = () => {
  const raw = localStorage.getItem('mathsim_users');
  return raw ? JSON.parse(raw) : {};
};

export const saveUsers = (users) => {
  localStorage.setItem('mathsim_users', JSON.stringify(users));
};

export const registerUser = (username, password) => {
  const users = getUsers();
  if (users[username]) return { success: false, error: 'Username already exists.' };
  users[username] = {
    id: username,
    password,
    createdAt: Date.now(),
    simulatorsRan: 0,
    sliderInteractions: 0,
    masteryScores: {},   // { simId: score }
    intuitionIndex: 0,
  };
  saveUsers(users);
  return { success: true, user: { id: username, ...users[username] } };
};

export const loginUser = (username, password) => {
  const users = getUsers();
  if (!users[username]) return { success: false, error: 'User not found.' };
  if (users[username].password !== password) return { success: false, error: 'Incorrect password.' };
  return { success: true, user: { id: username, ...users[username] } };
};

export const updateUserStats = (userId, patch) => {
  const users = getUsers();
  if (!users[userId]) return;
  users[userId] = { ...users[userId], ...patch };
  saveUsers(users);
  // Also update session
  const session = localStorage.getItem('mathsim_session');
  if (session) {
    const sessionUser = JSON.parse(session);
    if (sessionUser.id === userId) {
      localStorage.setItem('mathsim_session', JSON.stringify({ ...sessionUser, ...patch }));
    }
  }
};

export const getUser = (userId) => {
  const users = getUsers();
  return users[userId] || null;
};

export const recordSliderInteraction = (userId, simId) => {
  const users = getUsers();
  if (!users[userId]) return;
  const u = users[userId];
  u.sliderInteractions = (u.sliderInteractions || 0) + 1;
  const simScore = (u.masteryScores || {})[simId] || 0;
  u.masteryScores = { ...(u.masteryScores || {}), [simId]: simScore + 1 };
  // Intuition Index: average mastery across used sims
  const scores = Object.values(u.masteryScores);
  u.intuitionIndex = scores.length
    ? Math.min(100, Math.round(scores.reduce((a, b) => a + b, 0) / scores.length))
    : 0;
  saveUsers(users);
};

export const recordSimulatorRun = (userId) => {
  const users = getUsers();
  if (!users[userId]) return;
  users[userId].simulatorsRan = (users[userId].simulatorsRan || 0) + 1;
  saveUsers(users);
};
