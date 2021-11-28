export const HOST = "localhost";
export const USER = "root";
export const PASSWORD = "root";
export const DB = "quizzes";
export const dialect = "mysql";
export const pool = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
};