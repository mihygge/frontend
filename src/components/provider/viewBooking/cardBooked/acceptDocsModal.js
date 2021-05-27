import React from 'react';
import CustomModal from '../../../../modals';
import IconInfo from '../../../../assets/images/icon-info.svg';
import Form602 from '../../../../assets/documents/form-602.pdf';

const AcceptDocsModal = (props) => {
    const { isOpen, toggle, booking, executeConfirm } = props;
    return (
        <CustomModal
            isOpen={isOpen}
            toggle={toggle}
            className="modal-documents"
            modal_title="RCFE form and other relevant documents received?"
        >
            <p className="info">
                <img
                    src={IconInfo}
                    alt="Info Icon"
                    className="info-icon"
                />
                When moving their loved ones into residential care facilities for the elderly they
                have to submit a physician's report, called
                <a href={Form602} target="_blank" rel="noopener noreferrer">
                    &nbsp;Form 602&nbsp;
                </a>
                (in California) / RCFE Form for Assisted living/Care Home.
            </p>
            <i className="note">
                <b>Note: This action cannot be undone.</b>
            </i>
            <div
                className="buttons-container">
                <button className="btn-theme btn-transparent" onClick={toggle}>
                    Cancel
                </button>
                <button
                    className="btn-theme"
                    onClick={(e) => {
                        e.preventDefault();
                        executeConfirm(booking);
                        toggle();
                    }}
                >
                    Confirm?
                </button>
            </div>
        </CustomModal>
    );
};

export default AcceptDocsModal;
