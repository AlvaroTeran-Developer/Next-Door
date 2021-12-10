import React, { useState, useEffect, useContext } from "react";
import ReviewService from "../../../Services/ReviewService/reviews.service";
import UserContext from "../../../Context/UserContext/UserContext";
import { StarIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

let reviewService = new ReviewService();

const Options = [
  { value: 1, label: "1", checked: false },
  { value: 2, label: "2", checked: false },
  { value: 3, label: "3", checked: false },
  { value: 4, label: "4", checked: false },
  { value: 5, label: "5", checked: false },
];

export default function Reviews(props) {
  const [review, setReview] = useState({
    description: "",
    rating: 0,
    product: props.ProductId,
    seller: props.SellerId,
  });
  const [reviewList, setReviewList] = useState([]);

  let id = "";
  let type = "";
  if (props.ProductId === undefined) {
    id = props.SellerId;
    type = "seller";
  } else {
    id = props.ProductId;
    type = "product";
  }
  let { loggedUser } = useContext(UserContext);

  useEffect(() => {
    loadReviews();
  }, []);

  let handleInputChange = (e) => {
    const { name, value } = e.currentTarget;

    setReview((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  let handleSubmit = (e) => {
    e.preventDefault();

    reviewService
      .createReview(review.description, review.rating, review.product, review.seller)
      .then((response) => {
        loadReviews();
        if (props.ProductId) {
          props.loadReviewsFather();
        }
        setReview({
          description: "",
          product: props.ProductId,
          seller: props.SellerId,
        });
      })
      .catch((err) => console.log("error", err));
  };

  let deleteReview = (id) => {
    reviewService
      .deleteThisReview(id)
      .then((result) => {
        loadReviews();
        if (props.ProductId) {
          props.loadProduct();
          props.loadReviewsFather();
        }
      })
      .catch((err) => console.log(err));
  };
  let reviewListLength = reviewList.length;

  let loadReviews = () => {
    reviewService
      .getReviewsOhThis(id, type)
      .then((result) => {
        setReviewList(result.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="min-h-full">
        <main className="pb-10">
          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              <section aria-labelledby="notes-title">
                <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      {id !== props.ProductId ? (
                        <h2 id="notes-title" className="text-lg font-medium text-gray-900">
                          Comentarios del vendedor
                        </h2>
                      ) : (
                        <h2 id="notes-title" className="text-lg font-medium text-gray-900">
                          Comentarios del producto
                        </h2>
                      )}
                    </div>
                    {loggedUser?.loggedUser?.role === "User" && (
                      <>
                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={loggedUser?.loggedUser?.img_url}
                                alt=""
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <form onSubmit={handleSubmit}>
                                <div>
                                  <textarea
                                    value={review.description}
                                    id="comment"
                                    onChange={handleInputChange}
                                    name="description"
                                    rows={4}
                                    className="appearance-none block w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Añade un comentario"
                                  />
                                </div>
                                <h3 className="ml-5 mt-4">Deja tu nota</h3>
                                <div className="py-1 flex grid grid-cols-5">
                                  {Options.map((option) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center px-4 py-2 ml-6"
                                    >
                                      <input
                                        onChange={handleInputChange}
                                        id={option.value}
                                        value={option.value}
                                        name="rating"
                                        defaultChecked={false}
                                        type="radio"
                                        className="h-4 w-4 border-black rounded text-green-600 focus:ring-green-500 "
                                      />
                                      <label
                                        htmlFor={option.value}
                                        className="ml-3 text-sm text-gray-600"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                  <button
                                    type="submit"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    Comentar
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="px-4 py-6 sm:px-6">
                      <ul role="list" className="space-y-8">
                        {reviewList.map((comment) => (
                          <li key={comment.id}>
                            <div className="flex space-x-3 justify-between">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={comment.creator.img_url}
                                    alt=""
                                  />
                                </div>

                                <div className=" ml-2">
                                  <div className="text-sm mx-2">
                                    <Link
                                      to={`/user/${comment.creator._id}`}
                                      className="font-medium text-gray-900"
                                    >
                                      {comment.creator.username}
                                    </Link>
                                  </div>
                                  <div className="lg:col-span-2 lg:pr-8 mx-4 mt-2 ">
                                    <div className="flex items-center">
                                      <div className="flex items-center ">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                          <StarIcon
                                            key={rating}
                                            className={classNames(
                                              comment.rating > rating
                                                ? "text-green-500"
                                                : "text-gray-200",
                                              "h-5 w-5 flex-shrink-0"
                                            )}
                                            aria-hidden="true"
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-1 mx-5 text-sm text-gray-700">
                                    <p>{comment.description}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex place-items-end">
                                {loggedUser.loggedUser?._id === comment.creator._id && (
                                  <button
                                    type="button"
                                    onClick={() => deleteReview(comment._id)}
                                    className="mt-4 h-6 text-sm font-sm text-gray-300 border-b border-red-900 transition duration-500 ease-in-out transform hover:scale-90 hover:translate-y-1"
                                  >
                                    Borrar
                                  </button>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
