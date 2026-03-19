import axios from "axios";

const API_URL = "https://freshcanteen.onrender.com/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MenuItem {
    _id?: string;
    id: string; // Legacy ID or separate field
    name: string;
    price: number;
    image: string;
    category: string;
    tags: string[];
    calories: number;
    available: boolean;
}

export interface Order {
    _id?: string;
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
    _id?: string;
    email: string;
    name: string;
    role: "student" | "admin";
    id: string;
}

export interface Announcement {
    _id?: string;
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

// ─── Menu ────────────────────────────────────────────────────────────────────

export const getStoredMenu = async (): Promise<MenuItem[]> => {
    try {
        const res = await axios.get(`${API_URL}/menu`);
        return res.data;
    } catch (err) {
        console.error("Error fetching menu:", err);
        return [];
    }
};

export const updateStoredMenu = async (item: Partial<MenuItem>) => {
    try {
        if (item._id) {
            await axios.patch(`${API_URL}/menu/${item._id}`, item);
        } else {
            await axios.post(`${API_URL}/menu`, item);
        }
    } catch (err) {
        console.error("Error updating menu:", err);
    }
};

export const deleteMenuItem = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/menu/${id}`);
    } catch (err) {
        console.error("Error deleting menu item:", err);
    }
};

// ─── Orders ──────────────────────────────────────────────────────────────────

export const getStoredOrders = async (): Promise<Order[]> => {
    try {
        const res = await axios.get(`${API_URL}/orders`);
        return res.data;
    } catch (err) {
        console.error("Error fetching orders:", err);
        return [];
    }
};

export const saveOrder = async (order: Order) => {
    try {
        const res = await axios.post(`${API_URL}/orders`, order);
        return res.data;
    } catch (err) {
        console.error("Error saving order:", err);
        throw err;
    }
};

export const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
        await axios.patch(`${API_URL}/orders/${orderId}`, { status });
    } catch (err) {
        console.error("Error updating order status:", err);
    }
};

export const rateOrderApi = async (orderId: string, rating: number) => {
    try {
        await axios.patch(`${API_URL}/orders/${orderId}`, { rating });
    } catch (err) {
        console.error("Error rating order:", err);
    }
};

// ─── Session ─────────────────────────────────────────────────────────────────

const SESSION_KEY = "fc_session";

export const saveSession = async (session: UserSession) => {
    try {
        await axios.post(`${API_URL}/users/login`, session);
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (err) {
        console.error("Error saving session:", err);
    }
};

export const getSession = (): UserSession | null => {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
};

// ─── Announcements ────────────────────────────────────────────────────────────

export const getAnnouncements = async (): Promise<Announcement[]> => {
    try {
        const res = await axios.get(`${API_URL}/announcements`);
        return res.data;
    } catch (err) {
        console.error("Error fetching announcements:", err);
        return [];
    }
};

export const addAnnouncement = async (a: Omit<Announcement, "id" | "createdAt">) => {
    try {
        const res = await axios.post(`${API_URL}/announcements`, a);
        return res.data;
    } catch (err) {
        console.error("Error adding announcement:", err);
    }
};

export const deleteAnnouncementApi = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/announcements/${id}`);
    } catch (err) {
        console.error("Error deleting announcement:", err);
    }
};

// ─── Loyalty ─────────────────────────────────────────────────────────────

export const getLoyalty = async (email: string): Promise<LoyaltyData> => {
    try {
        const res = await axios.get(`${API_URL}/loyalty/${email}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching loyalty:", err);
        return { email, points: 0, totalEarned: 0 };
    }
};

export const addPointsApi = async (email: string, points: number) => {
    try {
        await axios.post(`${API_URL}/loyalty/update`, { email, pointsToAdd: points });
    } catch (err) {
        console.error("Error adding points:", err);
    }
};

export const redeemPointsApi = async (email: string, points: number): Promise<boolean> => {
    try {
        await axios.post(`${API_URL}/loyalty/update`, { email, pointsToRedeem: points });
        return true;
    } catch (err) {
        console.error("Error redeeming points:", err);
        return false;
    }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const generateToken = () => `#TK-${Math.floor(100 + Math.random() * 900)}`;
export const generateId = () => Math.random().toString(36).substr(2, 9);
export const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export const estimateWait = async (): Promise<number> => {
    try {
        const orders = await getStoredOrders();
        const activeOrders = orders.filter(o => o.status === "Pending" || o.status === "Preparing");
        return Math.max(4, activeOrders.length * 4);
    } catch {
        return 4;
    }
};

export const pointsToDiscount = (points: number) => (points / 100) * 2;
export const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(Number(price));
};
