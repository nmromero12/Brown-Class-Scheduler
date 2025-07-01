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

/**
 * Custom hook to access the cart context.
 * @returns The cart context value.
 */
export function useCart() {
  return useContext(CartContext);
}

/**
 * Provides cart state and actions to its children.
 * @param children - React child nodes.
 */
export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [icsData, setIcsData] = useState<string | null>(null);
  const [parsedEvents, setParsedEvents] = useState<any[]>([]);

  /**
   * Adds a course to the cart if it is not already present.
   * @param c - The course item to add.
   */
  const addToCart = useCallback(async (c: CartItem) => {
    if (!cartItems.find((course) => course.crn === c.crn)) {
      setCartItems((courses) => [...courses, c]);
    }
  }, [cartItems]);

  /**
   * Removes a course from the cart.
   * @param course - The course item to remove.
   */
  const removeFromCart = useCallback(async (course: CartItem) => {
    setCartItems((currItems) => {
      return currItems.filter((items) => items.crn !== course.crn);
    });
  }, []);

  /**
   * Initializes the cart with a given list of items.
   * @param items - The initial cart items.
   */
  const initializeCart = useCallback((items: CartItem[]) => {
    setCartItems(items);
  }, []);

  /**
   * Parses the cart items to generate calendar events and ICS data.
   * @param cart - The cart items to parse.
   */
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

  /**
   * Effect to parse cart whenever cartItems changes.
   */
  useEffect(() => {
    if (cartItems.length > 0) {
      parseCart(cartItems);
    } else {
      setIcsData(null);
    }
  }, [cartItems, parseCart]);

  /**
   * Exports the current calendar as an ICS file.
   */
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



