CartsProducts.prototype.getTotal = function () {
    return this.qty * (this.Product ? this.Product.price : 0);
  };

Carts.prototype.getTotal = ()=>{
    this.CartsProducts.qty * (this.Product ? this.Product.price : 0);
};