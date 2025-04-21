declare interface DecodedToken {
  id: string;
  userId: string;
  iat: number;
  exp: number;
}

declare interface SocketUser {
  userId: string;
  displayName: string;
  socketId: string;
}
