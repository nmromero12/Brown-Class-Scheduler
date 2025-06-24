import { createContext, useState } from "react";
import { Course, CartItem } from "./SearchCourse";
import { ReactNode, useContext } from "react";

type CartProviderProps = {
  children: ReactNode;
};

type CartContext = {
  cartItems: CartItem[];
  addToCart: (course: CartItem) => void;
  removeFromCart: (course: CartItem) => void;
  initializeCart: (courses: CartItem[]) => void;
};

const CartContext = createContext({} as CartContext);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  function addToCart(c: CartItem) {
    if (!cartItems.find((course) => course.crn === c.crn)) {
      setCartItems((courses) => [...courses, c]);
      console.log(cartItems);
    }
  }

  function removeFromCart(course: CartItem) {
    setCartItems((currItems) => {
      return currItems.filter((items) => items.crn !== course.crn);
    });
  }

  function initializeCart(items: CartItem[]) {
    setCartItems(items);
  }
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, initializeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}



