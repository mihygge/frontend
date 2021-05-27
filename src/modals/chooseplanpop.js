import React, { Component } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

class ChoosePlanPop extends Component{

    render(){
        return(
            <React.Fragment>

            <Modal isOpen={this.props.sendChoose} toggle={this.props.sendChoosPop}>
                    <button type="button" className="close modal__close" onClick={this.props.sendChoosPop}></button>
                    <ModalHeader></ModalHeader>
                    <ModalBody>
                    <div class="popMesText">Looks like you’ve increased the number of beds. You’re eligible for an upgraded subscription with another $140.88/year.</div>
                    </ModalBody>
                    <ModalFooter>
                    <div class="popupBtn">
                    <button class="popBtnAct" id="succPop" onClick={this.props.sendUpgpop}>Upgrade &amp;Pay $239.98/year</button>
                </div>
                    </ModalFooter>
                  </Modal>


            </React.Fragment>
        )
    }

}

export default ChoosePlanPop;