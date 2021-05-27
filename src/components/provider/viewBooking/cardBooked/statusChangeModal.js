import React from 'react';
import CustomModal from '../../../../modals';
import capitalize from 'capitalize';

const StatusChangeModal = (props) => {
    const { booking, isOpen, toggle, status, displayStatus, executeConfirm } = props;

    return (
        <CustomModal
            isOpen={isOpen}
            toggle={toggle}
            modal_title={`${capitalize(displayStatus)} booking?(#${booking.bookingID})`}
        >
            <div
                className="buttons-container"
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <button className="btn-theme btn-transparent" onClick={toggle}>
                    Close
                </button>
                <button
                    className="btn-theme"
                    onClick={(e) => {
                        e.preventDefault();
                        executeConfirm(booking, status);
                        toggle();
                    }}
                >
                    Continue
                </button>
            </div>
        </CustomModal>
    );
};

export default StatusChangeModal;
