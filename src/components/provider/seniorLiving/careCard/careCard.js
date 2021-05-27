import React from 'react';
import { Link } from 'react-router-dom';
import capitalize from 'capitalize'
import cogoToast from 'cogo-toast';

const CareCard = ({careDetails, type}) => {
    const viewDisabled = 'viewDisabled';
    const updateDisabled = 'updateDisabled';

    const displayToastMsg = (feature, serviceStatus, serviceCategory) => {
        const careOrHome = serviceCategory==='senior_living' ? 'care' : 'home';
        if(feature === viewDisabled){
            serviceStatus === 'draft' && cogoToast.info(`You cannot view ${careOrHome} details from draft status.`)
        }
        if(feature === updateDisabled){
            !serviceStatus && cogoToast.info(`You cannot edit this ${careOrHome} details as it is currently in review and approval is pending from miHygge.`)
        }
    }

    return (
        <div className="care-details-card">
            <div className="card-left">
                {
                    careDetails.attributes.image_url ? 
                    <img
                        src={careDetails.attributes.image_url}
                        alt="Home"
                        className="img-home"
                    /> : 
                    <div className="section-no-images img-home">
                        <p>No Image Available</p>
                    </div>
                }
                <div className="details-brief">
                    <li>
                        <span>Name of care</span>
                        <strong>{capitalize.words(careDetails.attributes.name)}</strong>
                    </li>
                    <li>
                        <span>Location</span>
                        <strong>
                            {
                                `${careDetails.attributes?.city ? `${capitalize.words(careDetails.attributes.city)},` : ''}
                                ${capitalize(careDetails.attributes.county)},
                                ${capitalize(careDetails.attributes.state)},
                                ${capitalize.words(careDetails.attributes.country)} `
                            }
                            {
                                careDetails.attributes.map_url ?
                                <a href={careDetails.attributes.map_url} target="_blank" rel="noopener noreferrer">
                                    [Map]
                                </a>
                                : null
                            }
                            
                        </strong>
                    </li>
                    <li>
                        <span className="text-uppercase">STATUS</span>
                        <strong className={`status-${careDetails.attributes.status} text-capitalize`}>{careDetails.attributes.status}</strong>
                    </li>
                </div>
            </div>
            <div className="card-right">
                <Link
                    className="btn-transparent-small"
                    onClick={() => displayToastMsg(viewDisabled, careDetails?.attributes?.status, careDetails?.attributes?.category)}
                    to={careDetails?.attributes?.status !== 'draft' ? `/care/${careDetails.id}` : '/provider'}
                >View</Link>
                <Link
                    className="btn-transparent-small"
                    onClick={() => displayToastMsg(updateDisabled, careDetails?.attributes?.can_update, careDetails?.attributes?.category)}
                    to={
                        careDetails?.attributes?.can_update ?
                        {
                            pathname: `/provider/${type}/update/${careDetails.id}`,
                            state: {
                                serviceId: careDetails.id,
                                serviceName: capitalize.words(careDetails.attributes.name),
                            }
                        } : '/provider'
                    }
                >Edit</Link>
            </div>
        </div>
    )
}

export default CareCard;
