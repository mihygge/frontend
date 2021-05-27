import React from 'react';
import cx from "classnames";

const Facilities = ({ conditional_class, header, facilities }) => {
    return (
        <div className={cx("section-facilities-list", conditional_class)}>
            <h2>{header}</h2>
            <div className="list-items">
                {
                    facilities &&
                    facilities.map((category, index) => (
                        <div key={index} className="list">
                            <h2>{Object.keys(category)}</h2>
                            <ul>
                                {
                                    Object.values(category) &&
                                    Object.values(category).map((facilities) => (
                                        facilities.map((facility, facilityIndex) => (
                                            <li key={facilityIndex}>{facility}</li>
                                        ))
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Facilities;