import { doc, setDoc, getDoc, updateDoc, serverTimestamp, deleteDoc, collection, query, where, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { db, auth } from "../main.tsx";
import { useState, useEffect } from 'react';

export type FriendRequest = {
    status: string;
    email: string;

}

export type User = {
  email: string;
  date: Date;
  uid: string;
}

export async function addUser(userId: string, userData: object) {
    await setDoc(doc(db, "users", userId), userData)
}

export async function addFriend(userId: string, friendId: string, friendEmail: string) {
    const friendsRef = collection(db, "users", userId, "friends");
    await setDoc(doc(friendsRef, friendId), { email: friendEmail })
}

export async function sendFriendRequest(senderId: string, recieverId: string, senderEmail: string, recieverEmail: string) {
    const inRequest = collection(db, "users", recieverId , "incomingRequests");
    const outRequest = collection(db, "users", senderId, "outgoingRequests")
    await setDoc(doc(inRequest, senderId), {status: "pending",
                                            senderEmail: senderEmail                                
    })
    
    await setDoc(doc(outRequest, recieverId), {status: "pending", recieverEmail: recieverEmail
    })
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
    };
  });

  return requests;
}

  


// export async function findSentFriendRequests(senderEmail: string) {
//   const requestsRef = collection(db, "users", user)
  
// }

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

export function Friends() {
    const [userSearch, setUserSearch] = useState("");
    const [hasSent, setHasSent] = useState<boolean>(false);
    const [activeScreen, setActiveScreen] = useState<'search' | 'requests' | 'friends'>('search');
    const [usersFound, setUsersFound] = useState<User | null>(null);
    const [entrance, setEntrance] = useState<boolean>(true);
    const [isSearching, setIsSearching] = useState(false);
    const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
    

    // Test getUserByEmailexport type user = {
  

    const handleSearch = async () => {
      try {
        setIsSearching(true);
        setEntrance(false);
        const userDoc = await getUserByEmail(userSearch);
        if (userDoc) {
          const foundUser = ({
            email: userDoc.email,
            date: userDoc.date,
            uid: userDoc.uid,
          })

          setUsersFound(foundUser);

          if (auth.currentUser) {
            const alreadySent = await checkSentRequests(auth.currentUser.uid, foundUser.uid); 
            setHasSent(alreadySent);
      }
        } 


          
          else {
          setUsersFound(null);
          setHasSent(false);
        }} finally {
          setIsSearching(false);
        }
         
    };

    


    const fetchRequests = async () => {
    const user = auth.currentUser?.uid;
    if (user) {
      const requests = await getIncomingRequests(user);
      setIncomingRequests(requests);
    }
  };


    useEffect(() => {
      fetchRequests();
    },[])

    useEffect(() => {
        if (activeScreen === 'requests') {
            setEntrance(true);
            setUserSearch("");
            setUsersFound(null);
        } else if (activeScreen === 'friends') {
            setEntrance(true);
            setUserSearch("");
            setUsersFound(null);
        }
    }, [activeScreen]);

    

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Friends</h1>
      <p className="text-gray-600">Connect with classmates and share your course schedules</p>
    </div>


    <div className="bg-white border border-gray-200 p-1 inline-flex rounded-md mb-6">
        <button onClick={() => setActiveScreen('search')} className="px-4 py-2 text-white bg-brown-600 rounded-l">Search Friends</button>
        <button onClick={() => setActiveScreen('requests')} className="px-4 py-2">Friend Requests <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded text-xs">3</span></button>
        <button onClick={() => setActiveScreen('friends')} className="px-4 py-2 rounded-r">My Friends <span className="ml-2 bg-brown-100 text-brown-800 px-2 py-1 rounded text-xs">5</span></button>
    </div>

    

    {/* Search Friends */}

    {activeScreen === 'search' && (
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

     {isSearching && (
    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900">Searching for friends...</h3>
    </div>
  )}
   
        
          
    <div className="space-y-4">
      {!entrance && !isSearching &&(
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
        <button onClick={() => sendFriendRequest(auth.currentUser?.uid!, usersFound.uid, auth.currentUser?.email!, usersFound.email)}
        className={`px-4 py-2 rounded ${
        hasSent 
        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
        : 'bg-brown-600 text-white hover:bg-brown-700'
        }`}>
          {hasSent ? 'Pending' : 'Send Request'}
        
        </button>
      </div>
      )}
    </div>
    

    </>

    )
}


    {/* Friend Requests */}
    {activeScreen === 'requests' && (
  <div className="bg-white rounded-lg shadow border mt-8 mb-6">
    <div className="p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Friend Requests</h3>

      {incomingRequests.length > 0 ? (
        incomingRequests.map((request, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-xl border flex justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-brown-600 rounded-full flex items-center justify-center text-white font-semibold">
                {request.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {request.email}
                </h4>
                <p className="text-gray-600 text-sm">{request.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                Accept
              </button>
              <button className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
                Decline
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-gray-50 p-4 rounded-xl border text-center text-gray-500">
          No incoming requests
        </div>
      )}
    </div>
  </div>
)}

    {/* Friends List */}

    {activeScreen === 'friends' && (
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