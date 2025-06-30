import { createContext, useState, useCallback, useEffect } from "react";
import { Course, CartItem } from "../types/course";
import { ReactNode, useContext } from "react";

type CartProviderProps = {
  children: ReactNode;
};

type CartContextItems = {
  cartItems: CartItem[];
  addToCart: (course: CartItem) => Promise<void>;
  removeFromCart: (course: CartItem) => Promise<void>;
  initializeCart: (courses: CartItem[]) => void;
  parseCart: (cart: CartItem[]) => Promise<void>;
  exportCalendar: () => void;
  parsedEvents: any[];
};

const CartContext = createContext({} as CartContextItems);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [icsData, setIcsData] = useState<string | null>(null);
  const [parsedEvents, setParsedEvents] = useState<any[]>([]);

  const addToCart = useCallback(async (c: CartItem) => {
    if (!cartItems.find((course) => course.crn === c.crn)) {
      setCartItems((courses) => [...courses, c]);
    }
  }, [cartItems]);

  const removeFromCart = useCallback(async (course: CartItem) => {
    setCartItems((currItems) => {
      return currItems.filter((items) => items.crn !== course.crn);
    });
  }, []);

  const initializeCart = useCallback((items: CartItem[]) => {
    setCartItems(items);
  }, []);


  const parseCart = useCallback(async (cart: CartItem[]) => {
    try {
      const parsedResponse = await fetch("http://localhost:8080/api/calendar/parse-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      });
      const parsedData = await parsedResponse.json();
      setParsedEvents(parsedData);

      const icsResponse = await fetch("http://localhost:8080/api/calendar/ics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });
      const ics = await icsResponse.text();
      setIcsData(ics);
    } catch (error) {
      setIcsData(null);
      console.error("Error parsing cart:", error);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      parseCart(cartItems);
    } else {
      setIcsData(null);
    }
  }, [cartItems, parseCart]);


  const exportCalendar = useCallback(() => {
    if (!icsData) {
      alert("Calendar data not ready");
      return;
    }
    const blob = new Blob([icsData], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brown_schedule.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }, [icsData]);

  

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, initializeCart, parseCart, exportCalendar, parsedEvents }}
    >
      {children}
    </CartContext.Provider>
  );
}



