# Blog App

Full-stack blog platform built with Spring Boot and React.

## Tech Stack

**Backend**
- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Lombok

**Frontend**
- React
- React Router
- Axios
- CSS

## Features

- JWT authentication with role-based access control
- User
  - Create, edit, delete blogs with multi-category and multi-image support
  - Like/dislike blogs
  - View reacted blogs
  - Manage profile
- Admin
  - Manage users, blogs, and categories from a dedicated panel
- Category-based blog filtering
- Pagination (5 blogs per page)
- Image carousel per blog
- Auto logout on credential change
- Cascade deletion (removing a user or category cleans up related data)

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

## License

This project is licensed under the MIT License.

> Built for personal portfolio purposes.
