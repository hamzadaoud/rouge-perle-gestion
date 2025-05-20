
import { Drink, Order, OrderItem, Revenue, TimeLog } from "../types";
import { getCurrentUser, registerActivity } from "./authService";

// Catalogue de boissons
const initialDrinks: Drink[] = [
  {
    id: "1",
    name: "Café Normal",
    price: 2.0,
    category: "Café",
    description: "Un café traditionnel de qualité"
  },
  {
    id: "2",
    name: "Espresso",
    price: 2.5,
    category: "Café",
    description: "Un café fort et concentré"
  },
  {
    id: "3",
    name: "Cappuccino",
    price: 3.5,
    category: "Café",
    description: "Espresso, lait mousseux et cacao"
  },
  {
    id: "4",
    name: "Latte",
    price: 4.0,
    category: "Café",
    description: "Espresso avec beaucoup de lait"
  },
  {
    id: "5",
    name: "Thé Vert",
    price: 3.0,
    category: "Thé",
    description: "Thé vert bio"
  },
  {
    id: "6",
    name: "Jus d'Orange",
    price: 3.5,
    category: "Jus",
    description: "Pressé à la minute"
  },
  {
    id: "7",
    name: "Jus de Banane",
    price: 3.8,
    category: "Jus",
    description: "Onctueux et rafraîchissant"
  },
  {
    id: "8",
    name: "Panaché",
    price: 4.0,
    category: "Boisson",
    description: "Bière et limonade"
  },
  {
    id: "9",
    name: "Petit Déjeuner",
    price: 8.5,
    category: "Repas",
    description: "Café, jus d'orange et viennoiserie"
  },
  {
    id: "10",
    name: "Lait au Chocolat",
    price: 3.2,
    category: "Boisson",
    description: "Lait chaud avec du chocolat artisanal"
  },
  {
    id: "11",
    name: "Coca-Cola",
    price: 3.0,
    category: "Soda",
    description: "Classique et rafraîchissant"
  },
  {
    id: "12",
    name: "Fanta",
    price: 3.0,
    category: "Soda",
    description: "Saveur orange pétillante"
  },
  {
    id: "13",
    name: "Eau Minérale Plate",
    price: 2.5,
    category: "Eau",
    description: "Eau minérale naturelle"
  },
  {
    id: "14",
    name: "Eau Minérale Gazeuse",
    price: 2.7,
    category: "Eau",
    description: "Eau minérale pétillante"
  },
];

// Initialiser le stockage local si nécessaire
const initStorage = () => {
  if (!localStorage.getItem("drinks")) {
    localStorage.setItem("drinks", JSON.stringify(initialDrinks));
  }
  
  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]));
  }
  
  if (!localStorage.getItem("timeLogs")) {
    localStorage.setItem("timeLogs", JSON.stringify([]));
  }
};

// Récupérer les données
export const getDrinks = (): Drink[] => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem("drinks") || "[]");
  } catch {
    return [];
  }
};

export const getOrders = (): Order[] => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  } catch {
    return [];
  }
};

export const getTimeLogs = (): TimeLog[] => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem("timeLogs") || "[]");
  } catch {
    return [];
  }
};

// Ajouter une commande
export const createOrder = (items: OrderItem[]): Order | null => {
  const user = getCurrentUser();
  
  if (!user) return null;
  
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice, 
    0
  );
  
  const newOrder: Order = {
    id: `order_${Date.now()}`,
    items,
    total,
    date: new Date(),
    agentId: user.id,
    agentName: user.name,
    completed: true
  };
  
  const orders = getOrders();
  orders.push(newOrder);
  
  localStorage.setItem("orders", JSON.stringify(orders));
  registerActivity(`A créé une commande de ${total.toFixed(2)}€`);
  
  return newOrder;
};

// Pointer une arrivée
export const clockIn = (): TimeLog | null => {
  const user = getCurrentUser();
  
  if (!user) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const logs = getTimeLogs();
  
  // Vérifier si l'utilisateur a déjà pointé aujourd'hui
  const existingLog = logs.find(
    log => log.userId === user.id && log.date === today && !log.clockOut
  );
  
  if (existingLog) {
    return existingLog;
  }
  
  const newLog: TimeLog = {
    id: `log_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    clockIn: new Date(),
    date: today
  };
  
  logs.push(newLog);
  localStorage.setItem("timeLogs", JSON.stringify(logs));
  registerActivity("A pointé son arrivée");
  
  return newLog;
};

// Pointer un départ
export const clockOut = (): TimeLog | null => {
  const user = getCurrentUser();
  
  if (!user) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const logs = getTimeLogs();
  
  const logIndex = logs.findIndex(
    log => log.userId === user.id && log.date === today && !log.clockOut
  );
  
  if (logIndex === -1) return null;
  
  logs[logIndex].clockOut = new Date();
  localStorage.setItem("timeLogs", JSON.stringify(logs));
  registerActivity("A pointé son départ");
  
  return logs[logIndex];
};

// Obtenir les revenus
export const getRevenues = (): Revenue[] => {
  const orders = getOrders();
  
  const revenueMap: Record<string, number> = {};
  
  orders.forEach(order => {
    const date = new Date(order.date).toISOString().split('T')[0];
    if (!revenueMap[date]) {
      revenueMap[date] = 0;
    }
    revenueMap[date] += order.total;
  });
  
  return Object.entries(revenueMap).map(([date, amount]) => ({
    date,
    amount
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
