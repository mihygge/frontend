import React, {useState, useEffect} from 'react';
import UserLog from '../../shared/userLog';
import logo from '../../../assets/images/logo.png';
import PaymentCard from '../paymentInformation/paymentCard';
import TokenPayment from '../paymentInformation/tokenPayment';
import subscriptionCheckout from '../../../api/subscription/checkoutApi';
import cardsListing from '../../../api/subscription/cardsApi';
import FooterSection from '../../commons/copyrights';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';
import cogoToast from 'cogo-toast'
import subscribeCare from '../../../api/subscription/subscribeCareApi';

import {StripeProvider, Elements} from 'react-stripe-elements';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

const Checkout = (props) => {
    const [subscriptionAmt, setSubscriptionAmt] = useState(0.00)
    const [taxes, setTaxes] = useState(0.00)
    const [bgCheckFee, setBgCheckFee] = useState(0.00)
    const [total, setTotal] = useState(0.00)
    const [convinienceFee, setConvinienceFee] = useState(0.00)
    const [payableAmt, setPayableAmt] = useState(0.00)
    const [cards, setCards] = useState([])
    const [cardForm, setCardForm] = useState(false)
    const [userDetail] = useLocalStorage('userDetails', {})

    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    const [redirect, setRedirect] = useState(false)

    if(redirect) {
        props.history.push("/account-details")
        props.history.go()
    }

    const paymentSubmit = (stripe) => {
        let userName = userDetail.first_name + '' + userDetail.last_name
        const { hide: hideLoading } = cogoToast.loading("Payment is processing. Please wait...", { hideAfter: 0 });

        stripe.createToken({type: 'card', name: userName}).then((result) => {
            subscribeCare('', result.token.id).then((res)=> {
                hideLoading();
                cogoToast.success("Successfully created subscription..")
                setRedirect(true)
            }).catch((err) => {
                console.log(err)
                hideLoading();
                cogoToast.error("Unable to process subscription. Please try later")
            })
        }).catch((result) => {
            console.log(result.error)
            hideLoading();
            cogoToast.error("Payment failed. Incorrect card details")
        })
    }

    useEffect(() =>{
        subscriptionCheckout()
            .then((res) => {
                setSubscriptionAmt((res.data.total_subscription_amount / 100).toFixed(2))
                setTaxes((res.data.taxes / 100).toFixed(2))
                setBgCheckFee((res.data.back_ground_check / 100).toFixed(2))
                setTotal((res.data.total / 100).toFixed(2))
                setConvinienceFee((res.data.convinience_fee / 100).toFixed(2))
                setPayableAmt((res.data.total_payable_amount / 100).toFixed(2))
            })
        
        cardsListing()
            .then(res => {
                setCards(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    return(
        <div className="wrapper-checkout">
            <div className="wrapper-header">
                <div className="custom-container">
                    <a className="header-logo header-logo-account" href="/">
                        <img src={logo} alt="Logo" />
                        <span>miHygge</span>
                    </a> 
                    <UserLog />  
                </div>
            </div>
            <div className="custom-container container-content container-checkout-payment">
                <h2 className="title-checkout">Buy Subscription & Secure Checkout</h2>
                <div className="payment-summary">
                    <h4 className="title-summary"><span>Payment summary</span></h4>
                    <div className="list-of-checks">
                        <label>Amount</label>
                        <ul className="list-unstyled m-0 p-0 list-top">
                            <li>
                                <span className="item-name">Total Subscription Amount</span>
                                <span className="item-cost">${subscriptionAmt}</span>
                            </li>
                            <li>
                                <span className="item-name">Taxes</span>
                                <span className="item-cost">${taxes}</span>
                            </li>
                            <li>
                                <span className="item-name">Background Check <em>(inclusive of tax)</em></span>
                                <span className="item-cost">${bgCheckFee}</span>
                            </li>
                            <li>
                                <strong className="item-name">Total</strong>
                                <strong className="item-cost">${total}</strong>
                            </li>
                        </ul>
                        <ul className="list-unstyled m-0 p-0">
                            <li>
                                <span className="item-name">Convenience fee (2%)</span>
                                <span className="item-cost">${convinienceFee}</span>
                            </li>
                            <li>
                                <strong className="item-name">Total payable amount</strong>
                                <strong className="item-cost">${payableAmt}</strong>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="section-card-holder">
                    <div className="card-holder-inner">
                        <div className="nav-custom-tabs nav-tabs-checkout">
                            <Nav>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => { toggle('1'); }}
                                    >
                                        Payment Details
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => { toggle('2'); }}
                                    >
                                        Credit card
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    { (cards.length > 0 && !cardForm)  ? 
                                        <TokenPayment cards={cards} disable={subscriptionAmt == 0.00}/> : null
                                    }
                                </TabPane>
                                <TabPane tabId="2">
                                    <StripeProvider apiKey={process.env.REACT_APP_MIH_STRIPE_PK}>
                                        <Elements>
                                            <PaymentCard disable={subscriptionAmt == 0.00} title="Pay" paymentSubmit={paymentSubmit}/> 
                                        </Elements>
                                    </StripeProvider>
                                </TabPane>
                            </TabContent>
                        </div>
                    </div> 
                </div>
            </div>
            <FooterSection />
        </div>
    )
}

export default Checkout;