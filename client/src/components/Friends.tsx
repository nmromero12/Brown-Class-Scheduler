import { getUserByEmail, checkSentRequests, getFriends, getIncomingRequests, acceptFriendRequest, sendFriendRequest } from '../firebase/friends.ts';
import { useState, useEffect } from 'react';
import { useUser } from './UserContext.tsx';
import { Friend, FriendRequest, User} from '../types/friend.ts';
import { auth } from '../main.tsx';




export function Friends() {
    const [userSearch, setUserSearch] = useState("");
    const [hasSent, setHasSent] = useState<boolean>(false);
    const [activeScreen, setActiveScreen] = useState<'search' | 'requests' | 'friends'>('search');
    const [usersFound, setUsersFound] = useState<User | null>(null);
    const [entrance, setEntrance] = useState<boolean>(true);
    const [isSearching, setIsSearching] = useState(false);
    const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [acceptedRequests, setAcceptedRequests] = useState<string[]>([]);
    const { user } = useUser();
    

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

          if (user) {
            const alreadySent = await checkSentRequests(user.uid, user.uid); 
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


    const findFriends = async () => {
    
    if (user) {
      const friends = await getFriends(user.uid)
      setFriends(friends);


    }
  }

    


    const fetchRequests = async () => {
    
    if (user) {
      const requests = await getIncomingRequests(user.uid);
      setIncomingRequests(requests);
    }
  };


  const isAlreadyFriend = (email: string) => {
    return friends.some(friend => friend.email == email);
  }
  


    useEffect(() => {
      fetchRequests();
      findFriends();
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
        <button onClick={() => setActiveScreen('requests')} className="px-4 py-2">Friend Requests <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded text-xs">{incomingRequests.length}</span></button>
        <button onClick={() => setActiveScreen('friends')} className="px-4 py-2 rounded-r">My Friends <span className="ml-2 bg-brown-100 text-brown-800 px-2 py-1 rounded text-xs">{friends.length}</span></button>
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
        <button
      disabled={hasSent || isAlreadyFriend(usersFound.email)}
      onClick={async () => { await sendFriendRequest(auth.currentUser?.uid!, usersFound.uid, auth.currentUser?.email!, usersFound.email);
        setHasSent(true)
      }}
      className={`px-4 py-2 rounded ${
        hasSent || isAlreadyFriend(usersFound.email)
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
          : 'bg-brown-600 text-white hover:bg-brown-700'
      }`}
    >
      {isAlreadyFriend(usersFound.email)
        ? 'Already Friends'
        : hasSent
        ? 'Pending'
        : 'Send Request'}
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
              <button onClick={async () => {

                const curUser = auth.currentUser
                if (curUser) {
                await acceptFriendRequest(curUser.uid, request.uid, request.email, curUser.email!)
                
                setIncomingRequests(prev => prev.filter(r => r.uid != request.uid));
                await findFriends(); 
              }
              }}className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                disabled={acceptedRequests.includes(request.uid)}>
                Accept Request
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
        <span className="bg-brown-100 text-brown-800 text-sm px-3 py-1 rounded">
          {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl border flex justify-between">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-brown-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {friend.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{friend.email}</h4>
                  <p className="text-gray-600 text-xs">Friend</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-brown-600 hover:text-brown-800" title="View Schedule">📅</button>
                <button className="text-red-600 hover:text-red-800" title="Remove Friend">🗑️</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 col-span-full">You have no friends yet.</div>
        )}
      </div>
    </div>
  </div>
)}

  </div>
    
    );
}