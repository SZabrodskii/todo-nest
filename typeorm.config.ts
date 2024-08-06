module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "postgres",
  database: "todo_list",
  entities: ["./dist/**/*.entity.js"],
  migrations: ["./dist/migrations/*.js"],
  cli: {
    migrationsDir: "./src/migrations",
  },
};