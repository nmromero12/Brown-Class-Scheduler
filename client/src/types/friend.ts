export type FriendRequest = {
    status: string;
    email: string;
    uid: string;
}


export type User = {
  email: string;
  date: Date;
  uid: string;
}

export type Friend = {
  email: string;
  uid: string;
}