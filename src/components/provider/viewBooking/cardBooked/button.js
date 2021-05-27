import React, { useState } from 'react';
import StatusChangeModal from './statusChangeModal';
import classnames from 'classnames';

const CardButton = (props) => {
    const { className, displayStatus, booking, handleStatusChange, status } = props;

    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => setIsOpen(!isOpen);

    return (
        <>
            <button className={classnames('btn-theme btn-transparent', className)} onClick={toggleModal}>
                {displayStatus}
            </button>
            <StatusChangeModal
                isOpen={isOpen}
                toggle={toggleModal}
                booking={booking}
                status={status}
                displayStatus={displayStatus}
                executeConfirm={handleStatusChange}
            />
        </>
    );
};

export default CardButton;
