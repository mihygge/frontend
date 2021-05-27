import React from "react";

const imgWithClick = { cursor: "pointer" };

const Photo = ({ index, onClick, photo, margin, direction, top, left, handleRemoveAsset }) => {
    const imgStyle = { margin: margin };
    if (direction === "column") {
        imgStyle.position = "absolute";
        imgStyle.left = left;
        imgStyle.top = top;
    }

    const handleClick = event => {
        onClick(event, { photo, index });
    };

    const handleCrossImage = (photo) => {
        handleRemoveAsset(photo.imageId, 'image');
    }

    return (
        <div className="sorted-image">
            <img
                style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
                {...photo}
                onClick={onClick ? handleClick : null}
                alt="img"
            />
            <span onClick={(e) => handleCrossImage(photo)}>x</span>
        </div>
    );
};

export default Photo;