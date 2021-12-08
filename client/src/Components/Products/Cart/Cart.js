import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductService from "../../../Services/ProductsServices/products.service";

export default function Cart(props) {
  const [loggedUser, setUser] = useState(props.loggedUser?.loggedUser);
  let [cart, setCart] = useState([]);
  let [subtotal, setSubtotal] = useState(0);
  const service = new ProductService();

  let getAllCart = () => {
    service.getCartProducts().then((result) => {
      setCart((cart = result.data.productsCart));
      setSubtotal((subtotal = 0));
      result.data.productsCart.forEach((element) => {
        element.product &&
          setSubtotal(
            Math.round((subtotal += element.product?.price * element.quantity) * 100) / 100
          );
      });
    });
  };

  let removeFromCart = (id) => {
    console.log(id);
    service.removeProductCart(id).then((response) => getAllCart());
  };
  // setCart((cart = response.data.productsCart))
  useEffect(() => {
    getAllCart();
  }, []);

  return (
    <>
      <div>
        <div class="local inset-y-0 right-0 pl-10 pr-10 max-w-full flex">
          <div class="w-screen ">
            <div class="h-full flex flex-col bg-white shadow-xl ">
              <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">
                    Shopping cart
                  </h2>
                  <div class="ml-3 h-7 flex items-center">
                    <button type="button" class="-m-2 p-2 text-gray-400 hover:text-gray-500">
                      <span class="sr-only">Close panel</span>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </button>
                  </div>
                </div>
                <div class="mt-8">
                  <div class="flow-root">
                    <ul class="-my-6 divide-y divide-gray-200">
                      {cart.map((elm) => {
                        return (
                          elm.product && (
                            <li class="py-6 flex" key={elm._id}>
                              <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                  src={elm.product.img_url}
                                  alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                                  class="w-full h-full object-center object-cover"
                                />
                              </div>
                              <div class="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div class="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <a href="#">{elm.product.name}</a>
                                    </h3>
                                    <p class="ml-4">{elm.product.price}€</p>
                                  </div>
                                  <p class="mt-1 text-sm text-gray-500">
                                    Vendedor: {elm.product.owner?.username}
                                  </p>
                                </div>
                                <div class="flex-1 flex items-end justify-between ">
                                  <p class="text-gray-500">Cantidad: {elm.quantity}</p>
                                  <div class="flex">
                                    <button
                                      onClick={() => removeFromCart(elm._id)}
                                      type="button"
                                      class="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div class="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{subtotal}€</p>
                </div>
                <p class="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div class="mt-6">
                  <a
                    href="#"
                    class="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Checkout
                  </a>
                </div>
                <div class="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{" "}
                    <Link to="/products">
                      <button
                        type="button"
                        class="text-indigo-600 font-medium hover:text-indigo-500"
                      >
                        Continue Shopping<span aria-hidden="true"> →</span>
                      </button>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}