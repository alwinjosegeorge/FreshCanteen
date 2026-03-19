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

export const menuItems: MenuItem[] = [
  { id: "1", name: "Avocado Harvest Bowl", price: 12.50, image: foodAvocadoBowl, category: "Meals", tags: ["VEGAN"], calories: 450, available: true },
  { id: "2", name: "Quinoa Pesto Flatbread", price: 10.00, image: foodPestoFlatbread, category: "Meals", tags: ["GLUTEN-FREE"], calories: 520, available: true },
  { id: "3", name: "Detox Green Glow", price: 6.50, image: foodGreenSmoothie, category: "Drinks", tags: ["COLD PRESSED"], calories: 180, available: true },
  { id: "4", name: "Lean Chicken Caesar", price: 11.20, image: foodChickenCaesar, category: "Meals", tags: ["HIGH PROTEIN"], calories: 390, available: true },
  { id: "5", name: "Artisanal Margherita", price: 4.50, image: foodMargherita, category: "Snacks", tags: ["VEGETARIAN"], calories: 280, available: true },
  { id: "6", name: "Falafel Hummus Bliss", price: 12.00, image: foodFalafel, category: "Meals", tags: ["GLUTEN-FREE"], calories: 420, available: true },
  { id: "7", name: "Fresh Mango Smoothie", price: 4.25, image: foodMangoSmoothie, category: "Drinks", tags: ["FRESH"], calories: 210, available: true },
  { id: "8", name: "Grilled Chicken Wrap", price: 8.50, image: foodChickenWrap, category: "Snacks", tags: ["HIGH PROTEIN"], calories: 350, available: false },
];
