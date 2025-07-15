SELECT  "Cart"."id"
       ,"Cart"."userid"
       ,"Products"."id"                 AS "Products.id"
       ,"Products"."name"               AS "Products.name"
       ,"Products"."description"        AS "Products.description"
       ,"Products"."price"              AS "Products.price"
       ,"Products"."category"           AS "Products.category"
       ,"Products->CartsProducts"."id"  AS "Products.CartsProducts.id"
       ,"Products->CartsProducts"."qty" AS "Products.CartsProducts.qty"
FROM "carts" AS "Cart"
LEFT OUTER JOIN
( "carts_products" AS "Products->CartsProducts"
	INNER JOIN "products" AS "Products"
	ON "Products"."id" = "Products->CartsProducts"."productid"
)
ON "Cart"."id" = "Products->CartsProducts"."cartid"
WHERE "Cart"."userid" = 1;