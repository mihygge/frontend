import React, { useState } from 'react';
import { Table } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import subscribeCare from '../../../api/subscription/subscribeCareApi';
import cogoToast from 'cogo-toast';

const TokenPayment = (props) => {
    const [redirect, setRedirect] = useState(false)

    const pay = (card_id) => {
        const { hide: hideLoading } = cogoToast.loading('checkout is happening. please wait....', { hideAfter: 0 });

        subscribeCare(card_id, false)
            .then(() => {
                hideLoading();
                cogoToast.info("Payment done successfully")
                setRedirect(true)
            })
            .catch((err) => {
                hideLoading();
                cogoToast.error("Sorry, payment was unsuccessfull")
                console.log(err)
            })          
    }

    if(redirect) {
        props.history.push("/account-details")
        props.history.go()
    }

    return(
        <div className="table-payment-info table-payment-in-checkout table-custom">
            <Table>
                <thead>
                    <tr>
                        <th>Card Holder Name</th>
                        <th>Card Number</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.cards.map((card, _index) => (
                            <tr key={card.id}>
                                <td>{card.holder_name}</td>
                                <td>XXXX-{card.last4}</td>
                                <td>
                                    <button className="btn-theme btn-no-box" onClick={() => pay(card.id)} disabled={props.disable}>Use & Pay</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default withRouter(TokenPayment);