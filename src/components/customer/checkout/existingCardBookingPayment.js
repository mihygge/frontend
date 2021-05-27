import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { withRouter } from "react-router-dom";
import cardsListing from "../../../api/subscription/cardsApi";
import confirmBookingApi from "../../../api/customer/confirmBookingApi";
import cogoToast from "cogo-toast";
import UpgradePop from "../../../modals/upgradepop";

const ExistingCardBookingPayment = (props) => {
    const [cards, setCards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const pay = (card_id) => {
        const {
            hide: hideLoading,
        } = cogoToast.loading("Payment is processing. Please wait...", {
            hideAfter: 0,
        });

        confirmBookingApi(props.bookingId, card_id, "card")
            .then((res) => {
                hideLoading();
                cogoToast.success(
                    "Payment for booking has been done successfully..."
                );
                setShowModal(true);
            })
            .catch((err) => {
                console.log(err);
                hideLoading();
                cogoToast.error("Unable to process payment. Please try later");
            });
    };

    useEffect(() => {
        setIsLoading(true);
        cardsListing()
            .then((res) => {
                setCards(res.data);
                setIsLoading(false);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="credit-card-section-wrapper credit-card-section-wrapper-customer">
            <div className="section-card-holder">
                <div className="table-payment-info table-payment-in-checkout table-custom">
                    <UpgradePop
                        isOpen={showModal}
                        bookingId={props.bookingId}
                    />
                    <div className="table-responsive">
                    {
                        cards.length === 0 ? (
                            isLoading ? 'Loading...' : 'No cards added'
                        ) : 
                        <Table>
                            <thead>
                                <tr>
                                    <th>Card Holder Name</th>
                                    <th>Card Number</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cards.map((card, _index) => (
                                    <tr key={card.id}>
                                        <td>{card.holder_name}</td>
                                        <td>XXXX-{card.last4}</td>
                                        <td>
                                            <button
                                                className="btn-theme btn-no-box"
                                                onClick={() => pay(card.id)}
                                            >
                                                Use & Pay
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(ExistingCardBookingPayment);
