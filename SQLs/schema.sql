DROP TABLE IF EXISTS users,
products,
carts,
carts_products;

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        firstName text NOT NULL,
        lastName text NOT NULL,
        email text UNIQUE NOT NULL
    );

CREATE TABLE
    products (
        id SERIAL PRIMARY KEY,
        name text NOT NULL,
        description text NOT NULL,
        price numeric(10, 2) NOT NULL
    );

CREATE TABLE
    carts (
        id SERIAL PRIMARY KEY,
        userId integer REFERENCES users (id) UNIQUE ON DELETE CASCADE,
    );

CREATE TABLE
    carts_products (
        id SERIAL PRIMARY KEY,
        cartid integer REFERENCES carts (id) ON DELETE CASCADE,
        productid integer REFERENCES products (id) ON DELETE CASCADE,
        qty integer NOT NULL,
        UNIQUE (cartId, productid)
    );

CREATE TABLE
    orders (
        id SERIAL PRIMARY KEY,
        userid integer REFERENCES users (id) ON DELETE CASCADE
    );

CREATE TABLE
    orders_products (
        id SERIAL PRIMARY KEY,
        orderid integer REFERENCES orders (id) ON DELETE CASCADE,
        productid integer REFERENCES products (id) ON DELETE CASCADE,
        qty integer NOT NULL,
        UNIQUE (orderid, productid)
    );