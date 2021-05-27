import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Route, Router, Redirect, Switch } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { setusername } from './manageState/ProviderHeader'
import HomeLayout from './layouts/home.layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThankYou from './components/shared/thankyou'
import useLocalStorage from './effects/LocalStorage/use-local-storage'
import ResetPassword from './components/resetPassword';
import ProviderDashboard from './components/provider/providerDashboard';
import HomeShare from './components/provider/homeShare';
import InternalLayoutView from './layouts/internal.layout.view';
import InternalLayoutCustomer from './layouts/internal.layout.customer';
import AccountDetails from './components/accountDetails';
import Checkout from './components/accountDetails/checkout';
import DocCallback from './components/docusign/DocCallback';
import AccountDetailsCustomer from './components/accountDetailsCustomer';
import CheckoutCustomer from './components/customer/checkout'
import CallbackSuccess from './components/stripe/callbackSuccess';
import CallbackFailure from './components/stripe/callbackFailure';
import GAListener from './utils/google-analytics';
import CustomerLandingLayout from './layouts/customer.landing.layout';
import ConfirmBooking from './components/customer/checkout/confirmBooking';
import ThankYouAfterSignUp from './components/shared/thankYouAfterSignUp';
import AskForDemo from './components/newToMihygge/askForDemo/askForDemo';
import CelebrateUS from './components/celebrateUs/celebrateUs';

const App = (props) => {
    const history = createBrowserHistory();
    const [username, _] = useLocalStorage('username', '');
    const [userDetails] = useLocalStorage('userDetails', {});
    const userRole = userDetails?.role;

    const trackingId = process.env.REACT_APP_GA_ID;

    useEffect(() => {
        props.setLoginUsername(username)
    }, [])

    return (
        <div>
            <Router history={history}>
                <GAListener trackingId={trackingId}>
                    {
                        !!userRole ? (
                            userRole==='provider' ? (
                                <Switch>
                                    {/* Only Provider */}
                                    <Route path="/provider" component={ProviderDashboard} />
                                    <Route path="/homeshare" component={HomeShare} />
                                    <Route path="/account-details" component={AccountDetails} />
                                    <Route path="/ds_return" component={DocCallback} />
                                    <Route path="/stripe/callback/success" component={CallbackSuccess} />
                                    <Route path="/stripe/callback/failure" component={CallbackFailure} />
                                    <Route path="/checkout" component={Checkout} />
                                    
                                    {/* Common Routes */}
                                    <Route exact path="/care/:id" component={InternalLayoutView} />
                                    <Route exact path="/thankyou" component={ThankYou} />
                                    <Route exact path="/thank-you" component={ThankYouAfterSignUp} />
                                    <Route path="/reset_password" component={ResetPassword} />

                                    {/* If 404, redirect to provider landing page */}
                                    <Route render={props => {
                                        return <Redirect push to="/provider" />
                                    }} />
                                </Switch>
                            ) : (
                                <Switch>
                                    {/* Only Customer */}
                                    <Route exact path="/customer" component={CustomerLandingLayout} />
                                    <Route path="/customer-search" component={InternalLayoutCustomer} />
                                    <Route path="/bookings/:id/confirm" component={ConfirmBooking} />
                                    <Route path="/account-details-customer" component={AccountDetailsCustomer} />
                                    <Route path="/checkout-customer" component={CheckoutCustomer} />
                                    <Route exact path="/ask-for-demo" component={AskForDemo} />
                                    <Route exact path="/celebrate-us" component={CelebrateUS} />


                                    {/* Common Routes */}
                                    <Route exact path="/care/:id" component={InternalLayoutView} />
                                    <Route exact path="/thankyou" component={ThankYou} />
                                    <Route exact path="/thank-you" component={ThankYouAfterSignUp} />
                                    <Route path="/reset_password" component={ResetPassword} />
                                    
                                    {/* If 404, redirect to customer landing page */}
                                    <Route render={props => {
                                        return <Redirect push to="/customer" />
                                    }} />
                                </Switch>
                            )
                        ) : (
                            <Switch>
                                {/* Guest Users */}
                                <Route exact path="/" component={HomeLayout} />
                                <Route exact path="/customer-search" component={InternalLayoutCustomer} />
                                <Route exact path="/ask-for-demo" component={AskForDemo} />
                                <Route exact path="/celebrate-us" component={CelebrateUS} />
                                <Route path="/reset_password" component={ResetPassword} />                                
                                <Route exact path="/thankyou" component={ThankYou} />
                                <Route exact path="/thank-you" component={ThankYouAfterSignUp} />

                                {/* If 404, redirect to homepage */}
                                <Route render={props => {
                                    return <Redirect push to="/" />
                                }} />
                            </Switch>
                        )
                    }
                </GAListener>
            </Router>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        setLoginUsername: username => dispatch(setusername({ username: username }))
    };
}
export default connect(null, mapDispatchToProps)(App);