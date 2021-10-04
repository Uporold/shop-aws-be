import {
  Connection,
  ConnectionManager,
  createConnection,
  getConnectionManager,
} from 'typeorm';
import connectionOptions from './connection-options';

// export class Database {
//   private connectionManager: ConnectionManager;
//
//   constructor() {
//     this.connectionManager = getConnectionManager();
//   }
//
//   public async getConnection(): Promise<Connection> {
//     const CONNECTION_NAME = `default`;
//     let connection: Connection;
//     if (this.connectionManager.has(CONNECTION_NAME)) {
//       connection = await this.connectionManager.get(CONNECTION_NAME);
//       if (connection.isConnected) {
//         await connection.close();
//         console.log(`Excess connection killed`);
//       }
//     }
//     console.log(`Start connection`);
//     return await createConnection(connectionOptions);
//   }
// }

export class Database {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`;

    let connection: Connection;

    if (this.connectionManager.has(CONNECTION_NAME)) {
      console.log('use existing connection');
      connection = this.connectionManager.get(CONNECTION_NAME);

      if (!connection.isConnected) {
        console.log('reconnect');
        connection = await connection.connect();
      }
    } else {
      console.log('create new connection');
      connection = await createConnection(connectionOptions);
    }

    return connection;
  }
}
