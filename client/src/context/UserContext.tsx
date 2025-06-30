import { createContext, useContext, useEffect, useState} from "react"
import { auth } from "../main"
import { onAuthStateChanged, User as FirebaseUser  } from "firebase/auth"

type UserContextType = {
    user: FirebaseUser | null;
    loading: boolean;
};


const UserContext = createContext<UserContextType>({user: null, loading: true});

export const useUser = () => useContext(UserContext);

export function UserProvider( {children }: {children: React.ReactNode}) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value = {{user, loading}}>
            {children}
        </UserContext.Provider>
    )

}
