import React from "react";
import { Link } from "react-router-dom";

function ProductCard(props) {
  let product = props.product;
  return (
    <div>
      <div key={product._id} className="group bg-white rounded-lg">
        <div className="w-full  aspect-w-1 aspect-h-1 bg-white overflow-hidden xl:aspect-w-7 xl:aspect-h-8 rounded-lg">
          <img
            src={product.img_url}
            className="group w-full h-80 object-center object-cover bg-white rounded-lg"
            alt="Product Img"
          />
        </div>
        <div className="pl-8 pb-4 bg-gray-50 rounded-lg">
          <h3 className="pt-4 pr-2 mb-6 text-sm text-black h-10">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-medium text-gray-900">
            {product.price} €
          </p>
          <Link to={`/products/${product._id}`}>
            <button
              type="button"
              className="mt-4 px-4 py-2 border border-transparent  shadow-sm text-sm font-medium rounded-md text-white bg-green-500  hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Detalles de producto
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
