import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import capitalize from 'capitalize';

const StaffDetailsPop = (props) => {
    const { staffDetails } = props;
    return(
        <Modal className="modal-mini modal-staff-details" isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader>
                Staff Detail
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <div className="list-staff">
                    <ul className="list-unstyled m-0 p-0">
                        {
                            staffDetails && staffDetails.length>0 &&
                            staffDetails.map((staff, index) => (
                                <li key={index}>
                                    <strong>{staff.staff_role}: </strong>
                                    <span>{staff.name && capitalize(staff.name)}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default StaffDetailsPop;