import { doc, setDoc, getDoc, updateDoc, serverTimestamp, deleteDoc, collection, query, where, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { db, auth } from "../main.tsx";
import { Friend, FriendRequest } from "../types/friend";

export async function addUser(userId: string, userData: object) {
    await setDoc(doc(db, "users", userId), userData)
}

export async function addFriend(userId: string, friendId: string, friendEmail: string, userEmail: string) {
    const friendsRef = collection(db, "users", userId, "friends");
    const usersRef = collection(db, "users", friendId, "friends");
    await setDoc(doc(friendsRef, friendId), { email: friendEmail, uid: friendId })
    await setDoc(doc(usersRef, userId), { email: userEmail, uid: userId })

  
}

export async function sendFriendRequest(senderId: string, recieverId: string, senderEmail: string, recieverEmail: string) {
    const inRequest = collection(db, "users", recieverId , "incomingRequests");
    const outRequest = collection(db, "users", senderId, "outgoingRequests")
    await setDoc(doc(inRequest, senderId), {status: "pending",
                                            senderEmail: senderEmail,
                                            uid: senderId                                
    })
    
    await setDoc(doc(outRequest, recieverId), {status: "pending", recieverEmail: recieverEmail, uid: recieverId
    })
}

export async function getFriends(userId: string) {
  const friendsRef = collection(db, "users", userId, "friends");
  const snapShot = await getDocs(friendsRef);
  const friends: Friend[] = snapShot.docs.map((doc) => {
    const data = doc.data();
    return {
      email: data.email,
      uid: data.uid
    }
  })
  return friends



}

export async function checkSentRequests(userId: string, friendId: string) {
  const outgoingRef = doc(db, "users", userId, "outgoingRequests", friendId)
  const docSnap = await getDoc(outgoingRef);
  return docSnap.exists()
  
  
}

export async function getIncomingRequests(userId: string) {
  const incomingRef = collection(db, "users", userId, "incomingRequests");
  const snapshot = await getDocs(incomingRef)

  const requests: FriendRequest[] = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      status: data.status,
      email: data.senderEmail,
      uid: data.uid,
    };
  });

  return requests;
}

  



export async function acceptFriendRequest(userId: string, friendId: string, friendEmail: string, userEmail: string) {
    await addFriend(userId, friendId, friendEmail, userEmail);

    await deleteDoc(doc(db, "users", userId, "incomingRequests", friendId));
    await deleteDoc(doc(db, "users", friendId, "outgoingRequests", userId));

}

export async function declineFriendRequest(userId: string, friendId: string) {
    await deleteDoc(doc(db, "users", userId, "incomingRequests", friendId));
    await deleteDoc(doc(db, "users", friendId, "outgoingRequests", userId));

}


export async function removeFriend(userId: string, friendId: string, friendEmail: string, userEmail:string) {
    const friendsRef = collection(db, "users", userId, "friends");
    const usersRef = collection(db, "users", friendId, "friends");
    await deleteDoc(doc(friendsRef, friendId))
    await deleteDoc(doc(usersRef, userId))
  
}



export async function getUserByEmail(email: string) {
    const usersRef = collection(db, "users");
    const q = query(
                    usersRef, 
                    where("email", "==", email),
                    where("email", "!=", auth.currentUser?.email))
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        return {
          email: data.email,
          date: data.date,
          uid: data.uid
        }
    } else {
        return null
    }
}