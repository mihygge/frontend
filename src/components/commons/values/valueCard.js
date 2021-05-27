import React from "react";
import arrowRight from "../../../assets/images/arrow-right-small.svg";
import { Link } from "react-router-dom";

const ValueCard = (props) => {
  const { src, title, activeRef } = props;

  return (
    <div className="card-values">
      <img src={src} alt={title} className="img-icon" />
      <h4>{title}</h4>
      <Link
        to={{
          pathname: "/celebrate-us",
          state: {
            activeRef: activeRef,
          },
        }}
      >
        <p className="learnMore">
          Learn more
          <img src={arrowRight} className="arrow" alt=">" />
        </p>
      </Link>
    </div>
  );
};

export default ValueCard;
