# Blog App

## Tech Stack

**Backend** — Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Hibernate, MySQL 8, Maven, Lombok

**Frontend** — React 18, React Router 6, Axios, CSS

## Features

- JWT authentication with role-based access control
- User — create, edit, delete blogs with multi-category and multi-image support
- User — like/dislike blogs, view reacted blogs, manage profile
- Admin — manage users, blogs, and categories from a dedicated panel
- Category-based blog filtering
- Pagination — 5 blogs per page
- Image carousel per blog
- Auto logout on credential change
- Cascade deletion — removing a user or category cleans up related data

## Setup

### 1. Clone

```bash
git clone https://github.com/Chaitraashree-C31/blog-app.git
cd blog-app
```

### 2. Database

```sql
CREATE DATABASE blogapp;
```

### 3. Backend

```bash
cd blog-app-backend
```

Update `application.properties` with your credentials:

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
jwt.secret=your_secret_key_min_32_characters
```

```bash
mvn spring-boot:run
```

Runs at `http://localhost:8080`

### 4. Frontend

```bash
cd blog-app-frontend
npm install
npm start
```

Runs at `http://localhost:3000`

### 5. Create Admin User

Register through the app, then run:

```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'your@email.com';
```

Log out and log back in.

## License

This project is licensed under the MIT License.

> Built for personal portfolio purposes.
