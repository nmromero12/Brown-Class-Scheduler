import { doc, setDoc, getDoc, updateDoc, serverTimestamp, deleteDoc, collection, query, where, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { db, auth } from "../main.tsx";
import { Friend, FriendRequest } from "../types/friend";

/**
 * Adds a user document to the "users" collection.
 * @param userId - The unique ID of the user.
 * @param userData - The user data object to store.
 */
export async function addUser(userId: string, userData: object) {
    await setDoc(doc(db, "users", userId), userData)
}

/**
 * Adds each user to the other's "friends" subcollection.
 * @param userId - The ID of the user adding a friend.
 * @param friendId - The ID of the friend being added.
 * @param friendEmail - The email of the friend.
 * @param userEmail - The email of the user.
 */
export async function addFriend(userId: string, friendId: string, friendEmail: string, userEmail: string) {
    const friendsRef = collection(db, "users", userId, "friends");
    const usersRef = collection(db, "users", friendId, "friends");
    await setDoc(doc(friendsRef, friendId), { email: friendEmail, uid: friendId })
    await setDoc(doc(usersRef, userId), { email: userEmail, uid: userId })

  
}

/**
 * Sends a friend request from sender to receiver.
 * @param senderId - The ID of the user sending the request.
 * @param recieverId - The ID of the user receiving the request.
 * @param senderEmail - The email of the sender.
 * @param recieverEmail - The email of the receiver.
 */
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

/**
 * Retrieves the list of friends for a user.
 * @param userId - The ID of the user.
 * @returns An array of Friend objects.
 */
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

/**
 * Checks if a friend request has already been sent.
 * @param userId - The ID of the user who sent the request.
 * @param friendId - The ID of the user who would receive the request.
 * @returns True if the request exists, false otherwise.
 */
export async function checkSentRequests(userId: string, friendId: string) {
  const outgoingRef = doc(db, "users", userId, "outgoingRequests", friendId)
  const docSnap = await getDoc(outgoingRef);
  return docSnap.exists()
}

/**
 * Retrieves incoming friend requests for a user.
 * @param userId - The ID of the user.
 * @returns An array of FriendRequest objects.
 */
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

/**
 * Accepts a friend request and adds both users as friends.
 * @param userId - The ID of the user accepting the request.
 * @param friendId - The ID of the user who sent the request.
 * @param friendEmail - The email of the friend.
 * @param userEmail - The email of the user.
 */
export async function acceptFriendRequest(userId: string, friendId: string, friendEmail: string, userEmail: string) {
    await addFriend(userId, friendId, friendEmail, userEmail);

    await deleteDoc(doc(db, "users", userId, "incomingRequests", friendId));
    await deleteDoc(doc(db, "users", friendId, "outgoingRequests", userId));

}

/**
 * Declines a friend request by removing it from both users' request lists.
 * @param userId - The ID of the user declining the request.
 * @param friendId - The ID of the user who sent the request.
 */
export async function declineFriendRequest(userId: string, friendId: string) {
    await deleteDoc(doc(db, "users", userId, "incomingRequests", friendId));
    await deleteDoc(doc(db, "users", friendId, "outgoingRequests", userId));

}

/**
 * Removes a friend from both users' friends lists.
 * @param userId - The ID of the user removing the friend.
 * @param friendId - The ID of the friend being removed.
 * @param friendEmail - The email of the friend.
 * @param userEmail - The email of the user.
 */
export async function removeFriend(userId: string, friendId: string, friendEmail: string, userEmail:string) {
    const friendsRef = collection(db, "users", userId, "friends");
    const usersRef = collection(db, "users", friendId, "friends");
    await deleteDoc(doc(friendsRef, friendId))
    await deleteDoc(doc(usersRef, userId))
}

/**
 * Retrieves a user by their email, excluding the current user.
 * @param email - The email to search for.
 * @returns The user object if found, otherwise null.
 */
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