import { createContext, useState, useCallback } from "react";
import { Course, CartItem } from "./SearchCourse";
import { ReactNode, useContext } from "react";

type CartProviderProps = {
  children: ReactNode;
};

type CartContextItems = {
  cartItems: CartItem[];
  addToCart: (course: CartItem) => Promise<void>;
  removeFromCart: (course: CartItem) => Promise<void>;
  initializeCart: (courses: CartItem[]) => void;
};

const CartContext = createContext({} as CartContextItems);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, initializeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}



