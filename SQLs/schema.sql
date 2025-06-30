DROP TABLE IF EXISTS users, products, carts, carts_products;

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        firstName text,
        lastName text,
        email text UNIQUE
    );

CREATE TABLE
    products (
        id SERIAL PRIMARY KEY,
        name text,
        description text,
        price numeric(10, 2)
    );

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    userId integer REFERENCES users(id) UNIQUE,
);

CREATE TABLE carts_products (
    id SERIAL PRIMARY KEY,
    cartid integer REFERENCES carts(id),
    productid integer REFERENCES products(id),
    qty integer NOT NULL,
    UNIQUE (cartId, productid) 
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    userid integer REFERENCES users(id)
);

CREATE TABLE orders_products (
    id SERIAL PRIMARY KEY,
    orderid integer REFERENCES orders(id),
    productid integer REFERENCES products(id),
    qty integer,
    UNIQUE (orderid, productid)
);

