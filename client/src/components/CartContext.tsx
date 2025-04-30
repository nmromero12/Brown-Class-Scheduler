import { createContext, useState } from "react";
import { Course } from "./SearchCourse";
import { ReactNode, useContext } from "react";


type CartProviderProps = {
    children: ReactNode
}

type CartContext = {
    cartItems: Course[];
    addToCart: (course: Course) => void;
    removeFromCart: (course: Course) => void;
}

const CartContext = createContext({} as CartContext)


export function useCart() {
    return useContext(CartContext)
}

export function CartProvider({ children }:
    
    CartProviderProps
) {
    const [cartItems, setCartItems] = useState<Course[]>([]);
    function addToCart (c: Course) {
        if (!cartItems.find(course => course.id === c.id)) {
            setCartItems(courses => [...courses, c]);
            console.log(cartItems);
            
        }
    }

    function removeFromCart (course: Course) {
        setCartItems(currItems => {
            return currItems.filter(items => items.id !== course.id)
        })
    }
    return (
        <CartContext.Provider value={{cartItems, addToCart, removeFromCart}}>
            {children}
        </CartContext.Provider>
    )
}
