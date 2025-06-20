import dotenv from 'dotenv';
dotenv.config();
export var DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/friends_db';
//# sourceMappingURL=env.helper.js.map