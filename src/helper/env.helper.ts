import dotenv from 'dotenv';

dotenv.config();

export const DB_CONNECTION_STRING: string = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/friends_db';