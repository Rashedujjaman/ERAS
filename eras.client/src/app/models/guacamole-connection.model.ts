export interface Connection {
  name: string;
  identifier: string;
  parentIdentifier: string;
  protocol: string;
  attributes: any;
  activeConnections: number;
  lastActive?: number;
}

export interface ConnectionResponse {
  [key: string]: Connection;
}
