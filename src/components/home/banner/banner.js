import React, {Component} from 'react';
import ProviderSignUp from '../../../modals/providersignup';
import CustomerSignup from '../../../modals/customerSignUp/customerSignUp';
import LoginContainer from '../../../containers/Login.container'
import './_banner.scss';
import LocationSuggestion from '../../customer/common/locationSuggestion';

class Banner extends Component {
    constructor(props){
        super(props);
        this.state = {
            providerSignUpModalIsOpen: false,
            customerSignUpModalIsOpen: false,
            loginModalIsOpen: false,
        };
    }

    toggleLogin = () => {
        const { loginModalIsOpen } = this.state;
        this.setState({
            loginModalIsOpen: !loginModalIsOpen,
            providerSignUpModalIsOpen: false,
        })
    }

    toggleProviderSignUp = () => {
        const { providerSignUpModalIsOpen } = this.state;
        this.setState({
            providerSignUpModalIsOpen: !providerSignUpModalIsOpen,
        });
    }

    toggleCustomerSignUp = () => {
        const { customerSignUpModalIsOpen } = this.state;
        this.setState({
            customerSignUpModalIsOpen: !customerSignUpModalIsOpen
        })
    }

    render(){
        const { providerSignUpModalIsOpen, customerSignUpModalIsOpen, loginModalIsOpen } = this.state;
        return(
            <React.Fragment>
                <div className="banner-wrapper-home">
                    <div className="custom-container-mini">
                        <div className="container-items">
                            <h1 className="title-main">Discover Senior Living With miHygge</h1>
                            <div className="section-search-and-buttons">
                                <LocationSuggestion />
                                {
                                    !this.props.isAuthenticated &&
                                    <div className="buttons-container">
                                        <button 
                                            className="btn-theme"
                                            onClick={this.toggleProviderSignUp}
                                        >
                                            Provide Senior Living & Care
                                        </button>
                                        <button
                                            className="btn-theme btn-transparent"
                                            onClick={this.toggleCustomerSignUp}
                                        >
                                            Find Senior Living & Care
                                        </button>
                                    </div>
                                }   
                            </div>
                        </div>
                    </div>
                </div>
                <LoginContainer 
                    toggle = {this.toggleLogin} 
                    isOpen = {loginModalIsOpen}
                />
                <ProviderSignUp
                    isOpen = {providerSignUpModalIsOpen}
                    toggle={this.toggleProviderSignUp}
                    toggleSignin={this.toggleLogin}
                />
                <CustomerSignup
                    isOpen = {customerSignUpModalIsOpen}
                    toggle={this.toggleCustomerSignUp}
                    toggleSignin={this.toggleLogin}
                />
            </React.Fragment>
        );
    }
}

export default Banner;