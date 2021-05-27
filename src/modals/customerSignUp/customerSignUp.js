import React, {useState} from 'react';
import {
    Nav,
    NavItem,
    NavLink,
    Modal,
    ModalHeader,
    ModalBody,
    TabContent,
    TabPane
} from 'reactstrap';
import classnames from 'classnames';
import CustomerForm from './customerForm';
import SocailWorkerForm from './socalWorkerForm';

const CustomerSignup = (props) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    return(
        <Modal isOpen={props.isOpen} toggle={props.toggle} className="customer-signup modal-signup">
            <ModalHeader>
                Sign up to access miHygge care
                <button className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <div className="tabs-secondary">
                    <Nav>
                        <NavItem>
                            <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { toggle('1'); }}> Customer </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { toggle('2'); }}> Social Worker </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <CustomerForm />
                        </TabPane>
                        <TabPane tabId="2">
                            <SocailWorkerForm />
                        </TabPane>
                    </TabContent>
                </div>
                <h5 className="click-to-action">Already have an account?
                    <button
                        className="btn-theme btn-no-box"
                        onClick={(e) => {
                            props.toggleSignin()
                            props.toggle()
                            e.stopPropagation()
                            e.preventDefault()
                        }}
                    >Sign In</button>
                </h5>
            </ModalBody>
        </Modal>
    )
}

export default CustomerSignup;