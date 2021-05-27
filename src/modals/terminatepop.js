import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter

   } from 'reactstrap';

class TerminatePop extends Component{

    render(){
        return(
            <React.Fragment>

            <Modal className="modal__popup modal-confirmation-pop" isOpen={this.props.sendTerminate} toggle={this.props.sendTeminatePop}>
                <ModalHeader className="modal__popup--header" >
                    <button type="button" className="close modal__close" onClick={this.props.sendTeminatePop}></button>
                </ModalHeader>
                <ModalBody className="modal__popup--body">
                    <div className="popMesText">Are you sure you want to Terminate</div>
                </ModalBody>
                <ModalFooter className="modal__popup--footer">
                    <div className="popupBtn">
                        <Button  className="popBtnAct cancelBtn" onClick={this.props.sendTeminatePop}>Cancel</Button>
                        <Button  className="popBtnAct">Terminate</Button>
                    </div>
                </ModalFooter>
            </Modal>
            </React.Fragment>
        )
    }

}

export default TerminatePop;