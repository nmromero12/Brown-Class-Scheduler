import { doc, setDoc, getDoc, updateDoc, serverTimestamp, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../main.tsx";
import { useState, useEffect } from 'react';

export type FriendRequest = {
    status: string;
    email: string;
}

export type User = {
  email: string;
  date: Date;
}

export async function addUser(userId: string, userData: object) {
    await setDoc(doc(db, "users", userId), userData)
}

export async function addFriend(userId: string, friendId: string, friendEmail: string) {
    const friendsRef = collection(db, "users", userId, "friends");
    await setDoc(doc(friendsRef, friendId), { email: friendEmail })
}

export async function sendFriendRequest(senderId: string, recieverId: string, senderEmail: string) {
    const requests = collection(db, "users", recieverId , "requests");
    await setDoc(doc(requests, senderId), {status: "pending",
                                            email: senderEmail
    })
}

export async function getFriendRequests(userId: string) {
    const requestsRef = collection(db, "users", userId, "requests");
    const snapshot = await getDocs(requestsRef);
    return snapshot.docs.map(doc => doc.data());
}

export async function acceptFriendRequest(userId: string, friendId: string, friendEmail: string, userEmail: string) {
    await addFriend(userId, friendId, friendEmail);
    await addFriend(friendId, userId, userEmail);

    await deleteDoc(doc(db, "users", userId, "requests"));

}



export async function getUserByEmail(email: string) {
    const usersRef = collection(db, "users");
    const q = query(
                    usersRef, 
                    where("email", "==", email),
                    where("email", "!=", auth.currentUser?.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return querySnapshot.docs[0];
    } else {
        return null
    }
}

export function Friends() {
    const [userSearch, setUserSearch] = useState("");
    const [requestsFound, setRequestsFound] = useState<FriendRequest[]>([]);
    const [requestsScreen, setRequestsScreen] = useState<boolean>(false);
    const [searchScreen, setSearchScreen] = useState<boolean>(true);
    const [friendsScreen, setFriendsScreen] = useState<boolean>(false);
    const [usersFound, setUsersFound] = useState<User | null>(null);
    const [entrance, setEntrance] = useState<boolean>(true);
    const [addFriendEmail, setAddFriendEmail] = useState("");
    const [addFriendResult, setAddFriendResult] = useState<string>("");
    

    // Test getUserByEmailexport type user = {
  

    const handleSearch = async () => {
        const userDoc = await getUserByEmail(userSearch);
        if (userDoc) {
          const userData = userDoc.data();
          setUsersFound({
            email: userData.email,
            date: userData.date,
          });
        } else {
          setUsersFound(null);
        }
        setEntrance(false);
    };

    const handleRequests = async() => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        alert("You need to sign in")
        return;
      }
      const requests = await getFriendRequests(currentUser.uid);
      const friendRequests: FriendRequest[] = requests.map((r: any) => ({
        status: r.status,
        email: r.email
      }));
      setRequestsFound(friendRequests);
      

    }

    useEffect(() => {
      handleRequests()


    }, [])

    

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Friends</h1>
      <p className="text-gray-600">Connect with classmates and share your course schedules</p>
    </div>

    <div className="bg-white border border-gray-200 p-1 inline-flex rounded-md mb-6">
      <button onClick={() =>{
        setSearchScreen(true);
        setFriendsScreen(false);
        setRequestsScreen(false);
      }} className="px-4 py-2 text-white bg-brown-600 rounded-l">Search Friends</button>
      <button onClick={() =>{
        setSearchScreen(false);
        setFriendsScreen(false);
        setRequestsScreen(true);
        setEntrance(true);
        setUserSearch("");
      }} className="px-4 py-2">Friend Requests <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded text-xs">3</span></button>
      <button onClick={() =>{
        setSearchScreen(false);
        setFriendsScreen(true);
        setRequestsScreen(false);
        setEntrance(true);
        setUserSearch("");
      }} className="px-4 py-2 rounded-r">My Friends <span className="ml-2 bg-brown-100 text-brown-800 px-2 py-1 rounded text-xs">5</span></button>
    </div>

    {/* Search Friends */}

    {searchScreen && (
   <>   
    <div className="bg-white rounded-lg shadow border mb-6">
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Find Friends</h2>
        <div className="flex gap-4">
          <input type="text" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="e.g., john_doe, jane@brown.edu" className="flex-1 border rounded px-4 py-2" />
          <button onClick={()=>{
            handleSearch()

          }}className="bg-brown-600 text-white px-4 py-2 rounded hover:bg-brown-700">Search</button>
        </div>
      </div>
    </div>
   
        
          
    <div className="space-y-4">
      {!usersFound && !entrance && (
      <div className="bg-brown-50 rounded-xl p-4 border border-brown-200">
        <h3 className="text-lg font-semibold text-brown-900">{usersFound ? "User Found" : "No user found"}</h3>
      </div> )}

      {entrance && (
  <div className="bg-brown-50 rounded-xl p-4 border border-brown-200 text-center">
    <h3 className="text-lg font-semibold text-brown-900">Add friends to see their schedule!</h3>
    <p className="text-gray-600 text-sm mt-2">Search for classmates by email to connect and view their course schedules.</p>
  </div>
)}
      
      
      
        {usersFound &&(
      <div className="bg-white rounded-lg border p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-brown-600 rounded-full flex items-center justify-center text-white font-semibold">J</div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{usersFound?.email}</h4>
            <p className="text-gray-600 text-sm">{usersFound?.email}</p>
            <span className="mt-1 inline-block bg-brown-100 text-brown-800 text-xs px-2 py-1 rounded">CS '25</span>
          </div>
        </div>
        <button className="bg-brown-600 text-white px-4 py-2 rounded hover:bg-brown-700">Send Request</button>
      </div>
      )}
    </div>
    

    </>

    )
}


    {/* Friend Requests */}
    {requestsScreen && (
    <div className="bg-white rounded-lg shadow border mt-8 mb-6">
      <div className="p-6 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Friend Requests</h3>


        {requestsFound.length > 0 ? (
        <div className="bg-gray-50 p-4 rounded-xl border flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-brown-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            {requestsFound.map((request) => (
            <div>
              <h4 className="text-lg font-medium text-gray-900">{request.email}</h4>
              <p className="text-gray-600 text-sm">{request.status}</p>
              <p className="text-gray-500 text-xs">Sent 6/22/2025</p>
            </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">Accept</button>
            <button className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">Decline</button>
          </div>
        </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-xl border text-center text-gray-500">
            No incoming requests
          </div>
        )}
      </div>
    </div>
)}

    {/* Friends List */}

    {friendsScreen && (
    <div className="bg-white rounded-lg shadow border mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">My Friends</h3>
          <span className="bg-brown-100 text-brown-800 text-sm px-3 py-1 rounded">5 friends</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border flex justify-between">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-brown-600 rounded-full flex items-center justify-center text-white font-semibold">M</div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Michael Johnson</h4>
                <p className="text-gray-600 text-xs">Biology '26</p>
                <p className="text-green-600 text-xs">● Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-brown-600 hover:text-brown-800" title="View Schedule">📅</button>
              <button className="text-red-600 hover:text-red-800" title="Remove Friend">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div> )}
  </div>
    
    );
}