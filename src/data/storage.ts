import { menuItems as rawInitialMenu } from "./menuData";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    tags: string[];
    calories: number;
    available: boolean;
}

export interface Order {
    id: string;
    student: string;
    studentEmail: string;
    items: string;
    token: string;
    status: "Pending" | "Preparing" | "Ready" | "Completed";
    total: string;
    totalNum: number;
    timestamp: string;
    date: string;
    rating?: number;
}

export interface UserSession {
    email: string;
    name: string;
    role: "student" | "admin";
    id: string;
}

export interface Announcement {
    id: string;
    title: string;
    body: string;
    emoji: string;
    createdAt: string;
    pinned?: boolean;
}

export interface LoyaltyData {
    email: string;
    points: number;
    totalEarned: number;
}

// ─── Keys ────────────────────────────────────────────────────────────────────

const MENU_KEY = "fc_menu";
const ORDERS_KEY = "fc_orders";
const SESSION_KEY = "fc_session";
const ANNOUNCEMENTS_KEY = "fc_announcements";
const LOYALTY_KEY = "fc_loyalty";

// ─── Menu ────────────────────────────────────────────────────────────────────

export const getStoredMenu = (): MenuItem[] => {
    const stored = localStorage.getItem(MENU_KEY);
    if (!stored) {
        const typed: MenuItem[] = (rawInitialMenu as any[]).map(item => ({
            ...item,
            price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
            calories: typeof item.calories === "string" ? parseInt(item.calories) : item.calories,
            available: item.available ?? true,
        }));
        localStorage.setItem(MENU_KEY, JSON.stringify(typed));
        return typed;
    }
    return JSON.parse(stored);
};

export const updateStoredMenu = (menu: MenuItem[]) => {
    localStorage.setItem(MENU_KEY, JSON.stringify(menu));
};

export const resetMenu = () => {
    localStorage.removeItem(MENU_KEY);
    return getStoredMenu();
};

// ─── Orders ──────────────────────────────────────────────────────────────────

export const getStoredOrders = (): Order[] => {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveOrder = (order: Order) => {
    const orders = getStoredOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    const orders = getStoredOrders();
    const i = orders.findIndex(o => o.id === orderId);
    if (i !== -1) {
        orders[i].status = status;
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
};

export const rateOrder = (orderId: string, rating: number) => {
    const orders = getStoredOrders();
    const i = orders.findIndex(o => o.id === orderId);
    if (i !== -1) {
        orders[i].rating = rating;
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
};

export const getOrdersByStudent = (email: string): Order[] => {
    return getStoredOrders().filter(o => o.studentEmail === email);
};

export const getLatestStudentOrder = (email: string): Order | null => {
    const orders = getOrdersByStudent(email).filter(o => o.status !== "Completed");
    return orders.length > 0 ? orders[0] : null;
};

// ─── Session ─────────────────────────────────────────────────────────────────

export const saveSession = (session: UserSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): UserSession | null => {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
};

// ─── Announcements ────────────────────────────────────────────────────────────

const defaultAnnouncements: Announcement[] = [
    { id: "1", title: "🌿 Welcome to FreshCanteen!", body: "Fresh meals, smart ordering. Place your first order and earn 50 bonus points!", emoji: "🎉", createdAt: new Date().toLocaleString(), pinned: true },
];

export const getAnnouncements = (): Announcement[] => {
    const stored = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (!stored) {
        localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(defaultAnnouncements));
        return defaultAnnouncements;
    }
    return JSON.parse(stored);
};

export const addAnnouncement = (a: Omit<Announcement, "id" | "createdAt">) => {
    const existing = getAnnouncements();
    const newA: Announcement = { ...a, id: generateId(), createdAt: new Date().toLocaleString() };
    const updated = [newA, ...existing];
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));
    return updated;
};

export const deleteAnnouncement = (id: string) => {
    const updated = getAnnouncements().filter(a => a.id !== id);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));
    return updated;
};

// ─── Loyalty Points ───────────────────────────────────────────────────────────

export const getLoyalty = (email: string): LoyaltyData => {
    const stored = localStorage.getItem(LOYALTY_KEY);
    const all: LoyaltyData[] = stored ? JSON.parse(stored) : [];
    return all.find(l => l.email === email) ?? { email, points: 0, totalEarned: 0 };
};

export const addPoints = (email: string, points: number) => {
    const stored = localStorage.getItem(LOYALTY_KEY);
    const all: LoyaltyData[] = stored ? JSON.parse(stored) : [];
    const idx = all.findIndex(l => l.email === email);
    if (idx !== -1) {
        all[idx].points += points;
        all[idx].totalEarned += points;
    } else {
        all.push({ email, points, totalEarned: points });
    }
    localStorage.setItem(LOYALTY_KEY, JSON.stringify(all));
};

export const redeemPoints = (email: string, points: number): boolean => {
    const stored = localStorage.getItem(LOYALTY_KEY);
    const all: LoyaltyData[] = stored ? JSON.parse(stored) : [];
    const idx = all.findIndex(l => l.email === email);
    if (idx !== -1 && all[idx].points >= points) {
        all[idx].points -= points;
        localStorage.setItem(LOYALTY_KEY, JSON.stringify(all));
        return true;
    }
    return false;
};

export const pointsToDiscount = (points: number) => (points / 100) * 2; // 100 pts = $2

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const generateToken = () => `#TK-${Math.floor(100 + Math.random() * 900)}`;
export const generateId = () => Math.random().toString(36).substr(2, 9);
export const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

// Estimate wait: 4 mins per pending/preparing order  
export const estimateWait = (): number => {
    const orders = getStoredOrders().filter(o => o.status === "Pending" || o.status === "Preparing");
    return Math.max(4, orders.length * 4);
};
