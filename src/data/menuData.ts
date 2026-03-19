import foodAvocadoBowl from "@/assets/food-avocado-bowl.jpg";
import foodPestoFlatbread from "@/assets/food-pesto-flatbread.jpg";
import foodGreenSmoothie from "@/assets/food-green-smoothie.jpg";
import foodChickenCaesar from "@/assets/food-chicken-caesar.jpg";
import foodMargherita from "@/assets/food-margherita.jpg";
import foodFalafel from "@/assets/food-falafel.jpg";
import foodMangoSmoothie from "@/assets/food-mango-smoothie.jpg";
import foodChickenWrap from "@/assets/food-chicken-wrap.jpg";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Meals" | "Snacks" | "Drinks";
  tags: string[];
  calories: number;
  available: boolean;
};

// Unsplash CDN images for new items
const IMG = {
  pasta: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  ramen: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=600&q=80",
  sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
  pancakes: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
  acaiBowl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80",
  tacos: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  lemonade: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80",
  icedCoffee: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
  watermelon: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
  granola: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80",
  fruitCup: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",
};

export const menuItems: MenuItem[] = [
  // ── Meals ──────────────────────────────────────────────────────────────────
  { id: "1", name: "Avocado Harvest Bowl", price: 12.50, image: foodAvocadoBowl, category: "Meals", tags: ["VEGAN"], calories: 450, available: true },
  { id: "2", name: "Quinoa Pesto Flatbread", price: 10.00, image: foodPestoFlatbread, category: "Meals", tags: ["GLUTEN-FREE"], calories: 520, available: true },
  { id: "4", name: "Lean Chicken Caesar", price: 11.20, image: foodChickenCaesar, category: "Meals", tags: ["HIGH PROTEIN"], calories: 390, available: true },
  { id: "6", name: "Falafel Hummus Bliss", price: 12.00, image: foodFalafel, category: "Meals", tags: ["GLUTEN-FREE"], calories: 420, available: true },
  { id: "9", name: "Creamy Mushroom Pasta", price: 10.50, image: IMG.pasta, category: "Meals", tags: ["VEGETARIAN"], calories: 580, available: true },
  { id: "10", name: "Classic Smash Burger", price: 13.00, image: IMG.burger, category: "Meals", tags: ["BEEF"], calories: 720, available: true },
  { id: "11", name: "Spicy Veggie Ramen", price: 9.50, image: IMG.ramen, category: "Meals", tags: ["VEGAN"], calories: 480, available: true },
  { id: "12", name: "Salmon Sushi Platter", price: 15.00, image: IMG.sushi, category: "Meals", tags: ["HIGH PROTEIN"], calories: 340, available: true },
  { id: "13", name: "Street Tacos (3 pcs)", price: 9.00, image: IMG.tacos, category: "Meals", tags: ["SPICY"], calories: 410, available: true },
  { id: "14", name: "Garden Power Salad", price: 8.50, image: IMG.salad, category: "Meals", tags: ["VEGAN"], calories: 290, available: true },

  // ── Snacks ─────────────────────────────────────────────────────────────────
  { id: "5", name: "Artisanal Margherita", price: 4.50, image: foodMargherita, category: "Snacks", tags: ["VEGETARIAN"], calories: 280, available: true },
  { id: "8", name: "Grilled Chicken Wrap", price: 8.50, image: foodChickenWrap, category: "Snacks", tags: ["HIGH PROTEIN"], calories: 350, available: true },
  { id: "15", name: "Fluffy Buttermilk Pancakes", price: 6.00, image: IMG.pancakes, category: "Snacks", tags: ["SWEET"], calories: 460, available: true },
  { id: "16", name: "Acai Power Bowl", price: 7.50, image: IMG.acaiBowl, category: "Snacks", tags: ["VEGAN", "FRESH"], calories: 320, available: true },
  { id: "17", name: "Honey Granola Parfait", price: 5.50, image: IMG.granola, category: "Snacks", tags: ["VEGETARIAN"], calories: 380, available: true },
  { id: "18", name: "Club Sandwich", price: 7.00, image: IMG.sandwich, category: "Snacks", tags: ["HIGH PROTEIN"], calories: 430, available: true },
  { id: "19", name: "Fresh Fruit Cup", price: 4.00, image: IMG.fruitCup, category: "Snacks", tags: ["VEGAN"], calories: 120, available: true },

  // ── Drinks ─────────────────────────────────────────────────────────────────
  { id: "3", name: "Detox Green Glow", price: 6.50, image: foodGreenSmoothie, category: "Drinks", tags: ["COLD PRESSED"], calories: 180, available: true },
  { id: "7", name: "Fresh Mango Smoothie", price: 4.25, image: foodMangoSmoothie, category: "Drinks", tags: ["FRESH"], calories: 210, available: true },
  { id: "20", name: "Sparkling Pink Lemonade", price: 3.75, image: IMG.lemonade, category: "Drinks", tags: ["SUGAR-FREE"], calories: 60, available: true },
  { id: "21", name: "Vanilla Iced Coffee", price: 5.00, image: IMG.icedCoffee, category: "Drinks", tags: ["CAFFEINATED"], calories: 150, available: true },
  { id: "22", name: "Watermelon Mint Cooler", price: 4.50, image: IMG.watermelon, category: "Drinks", tags: ["FRESH", "VEGAN"], calories: 90, available: true },
];
