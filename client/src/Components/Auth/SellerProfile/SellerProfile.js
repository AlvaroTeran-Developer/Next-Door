import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import SellerProducts from "../../Products/SellerProducts/SellerProducts";
import SellerService from "../../../Services/SellerServices/seller.service";
import ReviewList from "../../Review/ReviewList/ReviewList";
import ReviewService from "../../../Services/ReviewService/reviews.service";
import EditSellerProfile from "./EditSellerProfile";
import { Link } from "react-router-dom";
import ConversationService from "../../../Services/ConversationServices/conversation.service";

let service = new SellerService();
let reviewService = new ReviewService();
let conversationService = new ConversationService();

export default function SellerProfile(props) {
  let user = props.loggedUser;
  let [seller, setSeller] = useState();
  const [isOpen, setOpen] = useState(false);
  const { id } = props.match.params;
  const [ownerProfile, setOwnerProfie] = useState(id);
  const [reviewList, setReviewList] = useState([]);
  const [showProduts, setshowProduts] = useState(false);
  const [showReviews, setshowReviews] = useState(false);
  const [chatAllready, setAllready] = useState(false);
  const [conversation, setConversation] = useState("");

  useEffect(() => {
    if (!seller) {
      loadSeller();
    }
    setOwnerProfie(id);
    loadReviews();
    findConversation();
  }, []);

  let renderProducts = () => {
    setshowReviews(false);
    return setshowProduts(true);
  };

  let renderReviews = () => {
    setshowReviews(true);
    return setshowProduts(false);
  };

  let openModal = () => {
    setOpen(true);
  };
  let closeModal = () => {
    setOpen(false);
  };

  let loadSeller = () => {
    service.getSeller(id).then((result) => {
      setSeller(result.data);
    });
  };

  let createConversation = () => {
    conversationService.getNewConversation(user?._id, id).then((result) => {
      console.log(result);
    });
  };
  let findConversation = () => {
    conversationService.findConversation(id).then((response) => {
      setConversation(response.data[0]._id);
      props.getConversation(response.data[0]);
      response.data.length > 0 && setAllready(true);
    });
  };

  let loadReviews = () => {
    reviewService
      .getReviewsOhThis(id, "seller")
      .then((result) => {
        setReviewList(result.data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="bg-gray-900 lg:pb-80">
      <div className="lg:flex lg:justify-between mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24 ">
        <div className="lg:flex lg:justify-between my-auto">
          <img
            className="h-40 mx-auto lg:my-auto lg:mx-0 w-40 rounded-full xl:w-56 xl:h-56 lg:mr-20  border border-white p-2"
            src={seller?.img_url}
            alt="User"
          />
          <div className="flex lg:justify-between justify-center mt-8">
            <div className="font-medium text-lg text-center lg:text-left lg:pr-4">
              <h3 className="text-white">{seller?.username}</h3>
              <div className="text-green-300 text-sm my-2">{seller?.email}</div>
              <div className="text-green-300 text-sm my-2 max-w-xs ">
                {seller?.address}
              </div>
              <div className="text-white text-sm my-2 ">
                {seller?.description}
              </div>
              <div>
                {user?._id === ownerProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={openModal}
                      className="mx-auto my-4 h-6 text-sm font-medium  text-gray-300 border-b border-green-600 transition duration-500 ease-in-out transform hover:scale-90 hover:translate-y-1"
                    >
                      Editar perfil
                    </button>
                    <div className="flexlg:block">
                      <Link
                        to={"/chat"}
                        className="mx-auto my-4 h-6 text-sm font-medium  text-gray-300 border-b border-green-600 transition duration-500 ease-in-out transform hover:scale-90 hover:translate-y-1"
                      >
                        Ver tus chats
                      </Link>
                    </div>
                  </>
                ) : !chatAllready ? (
                  props.loggedUser && (
                    <Link
                      to={"/chat"}
                      onClick={createConversation}
                      className="mx-auto my-4 h-6 text-sm font-medium  text-gray-300 border-b border-green-600 transition duration-500 ease-in-out transform hover:scale-90 hover:translate-y-1"
                    >
                      Conversación con el comprador
                    </Link>
                  )
                ) : (
                  props.loggedUser && (
                    <Link
                      to={`/chat/${conversation}`}
                      className="mx-auto my-4 h-6 text-sm font-medium  text-gray-300 border-b border-green-600 transition duration-500 ease-in-out transform hover:scale-90 hover:translate-y-1"
                    >
                      Abre tu conversacion
                    </Link>
                  )
                )}
                {(showProduts || showReviews) === false && (
                  <>
                    <div className="flex lg:block">
                      <button
                        type="button"
                        onClick={renderProducts}
                        className="mx-auto my-4 h-6 text-sm font-medium  text-gray-300 border-b border-green-600 transition duration-500 ease-in-out transform hover:scale-90 hover:translate-y-1"
                      >
                        Mostrar productos
                      </button>
                    </div>
                    <div className="flexlg:block">
                      <button
                        type="button"
                        onClick={renderReviews}
                        className="mx-auto h-6 my-4 text-sm font-medium  text-gray-300 border-b border-green-600 transition duration-500 ease-in-out transform hover:scale-90 hover:translate-y-1"
                      >
                        Mostrar comentarios
                      </button>
                    </div>
                  </>
                )}
                {showProduts ? (
                  <>
                    <div className="flex lg:block">
                      <button
                        type="button"
                        onClick={renderReviews}
                        className="mx-auto my-4 h-6 text-sm font-medium  text-gray-300 border-b border-green-600 transition duration-500 ease-in-out transform hover:scale-90 hover:translate-y-1"
                      >
                        Mostrar comentarios
                      </button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {showReviews ? (
                  <>
                    <div className="flex lg:block">
                      <button
                        type="button"
                        onClick={renderProducts}
                        className="mx-auto my-4 h-6 text-sm font-medium  text-gray-300 border-b border-green-600 transition duration-500 ease-in-out transform hover:scale-90 hover:translate-y-1"
                      >
                        Mostrar productos
                      </button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto "
            onClose={setOpen}
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0 "
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className=" sm:inline-block sm:align-middle sm:h-12"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Fragment>
                  <EditSellerProfile
                    seller={seller}
                    loadSeller={loadSeller}
                    closeModal={closeModal}
                  />
                </Fragment>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <img
          src={seller?.map_img}
          className="mx-auto rounded-lg"
          alt="map"
        ></img>
      </div>
      {showProduts && <SellerProducts products={seller?.products} id={id} />}
      {showReviews && <ReviewList SellerId={id} />}
    </div>
  );
}
