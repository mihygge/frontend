import React, { Component } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

class SubmitDetailsPop extends Component{

    render(){
        return(
            <React.Fragment>

            <Modal isOpen={this.props.sendSub} toggle={this.props.sendSubPop}>
                    <button type="button" className="close modal__close" onClick={this.props.sendSubPop}></button>
                    <ModalHeader></ModalHeader>
                    <ModalBody>
                    <div class="popupMid">
                        <div class="popMesText">
                        All the information provided for this Care is saved. Would you like to add more Care’s or continue to checkout and subcribe?</div>

                        </div>
                    </ModalBody>
                    <ModalFooter>
                    <div class="popupBtn">
                            <a href="add-newcare.html" class="popBtnAct cancelBtn">Add more Care</a>
                            <button class="popBtnAct" id="choosePop" onClick={this.props.sendChoosPop}>Choose a Plan &amp; Pay</button>
                        </div>
                    </ModalFooter>
                  </Modal>


            </React.Fragment>
        )
    }

}

export default SubmitDetailsPop;