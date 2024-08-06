import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 3650,
    username: "admin",
    password: "postgres",
    database: "todo_list",
    entities: ["./dist/**/*.entity.js"],
    migrations: ["./dist/migrations/*.js"],
    cli: {
        migrationsDir: "./src/migrations",
    },
});