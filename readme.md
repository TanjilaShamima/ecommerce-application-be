# E-commerce MERN Stack project

- /test -> health check(D)
- /seed -> seeding some data (D)
- /api/users -> 
    - POST - /register --> create the user account
    - POST - /activate --> activate the user account
    - GET  - /profile --> get the user account
    - DELETE - /:id --> delete the user account
    - PUT - /:id --> update the user account
    - PUT - /update-password/:id --> update the user password
    - POST - /forget-password --> reset the password
    - PUT - Admin - ban/:id --> ban the user
    - PUT - Admin - unban/:id --> unban the user
    - GET - Admin --> /export-users --> export the users
    - GET - Admin --> /all-users --> get All users

- /api/auth (JWT Auth)
    - POST --> /login --> isLoggedOut --> user login 
    - POST --> /logout --> isLoggedIn --> user logout
    - GET --> /refresh --> get refresh token

- Middleware
    - isLoggedIn
    - isLoggedOut
    - isAdmin
    - uploadFile
    - getRefreshToken
    - userValidation
    - runValidation

- /api/categories (CRUD)
    - POST / --> create the category (Admin)
    - GET / --> get all the categories (Admin)
    - GET /:id --> get single category (Admin)
    - POST / --> create a category (Admin)
    - DELETE /:id --> delete a category (Admin)
    - PUT /:id --> update a category (Admin)

- /api/products (CRUD)
    - POST / --> create the product (Admin)
    - GET / --> get all the product (Admin)
    - GET /:id --> get single product (Admin)
    - POST / --> create a product (Admin)
    - DELETE /:id --> delete a product (Admin)
    - PUT /:id --> update a product (Admin)

- /api/orders (CRUD)
    - POST / --> create the order (Admin)
    - GET / --> get all the order (Admin)
    - GET /:id --> get single order (Admin)
    - POST / --> create a order (Admin)
    - DELETE /:id --> delete a order (Admin)
    - PUT /:id --> update a order (Admin)

- /api/payment
    - GET /token --> get the payment token (Admin / User)
    - POST /process-payment --> process the payment

- package that we will need
    - `npm install express cors http-error multer body-parser bcrypt jsonwebtoken nodemailer cookie-parser`
    - `npm install --save-dev morgan nodemon`