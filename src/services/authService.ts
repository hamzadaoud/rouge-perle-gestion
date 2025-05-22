import { User, UserRole } from "../types";

// Dans une vraie application, ces données seraient stockées dans une base de données
const users: User[] = [
  {
    id: "admin1",
    email: "Mostapha@perle-rouge.com",
    name: "Mostapha",
    role: "admin",
  },
  {
    id: "agent1",
    email: "Aziz@perle-rouge.com",
    name: "Aziz",
    role: "agent",
  },
  {
    id: "agent2",
    email: "Noureddine@perle-rouge.com",
    name: "Noureddine",
    role: "agent",
  },
];

// Cette fonction simule un stockage local des mots de passe
// Dans une vraie application, on utiliserait un hash sécurisé stocké en base de données
const passwords: Record<string, string> = {
  "Mostapha@perle-rouge.com": "DARANE1967",
  "Aziz@perle-rouge.com": "AZIZ3435",
  "Noureddine@perle-rouge.com": "NOUREDDINE7080",
};

export const authenticate = (email: string, password: string): User | null => {
  const user = users.find((user) => user.email === email);
  
  if (user && passwords[email] === password) {
    // Ne jamais stocker le mot de passe dans le localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("currentUser");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem("currentUser");
};

export const checkIsAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

export const registerActivity = (action: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const activities = getStoredActivities();
  
  activities.push({
    id: `act_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    action,
    timestamp: new Date()
  });
  
  localStorage.setItem("activities", JSON.stringify(activities));
};

export const getStoredActivities = () => {
  try {
    return JSON.parse(localStorage.getItem("activities") || "[]");
  } catch {
    return [];
  }
};
