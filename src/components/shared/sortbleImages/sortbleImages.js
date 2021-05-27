import React, { useState, useEffect } from "react";
import Gallery from "react-photo-gallery";
import Photo from "./photo";
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";

const SortablePhoto = SortableElement(item => <Photo {...item} />);

const SortableGallery = SortableContainer(({ items, handleRemoveAsset }) => (
    <Gallery photos={items} renderImage={props => <SortablePhoto {...props} handleRemoveAsset={handleRemoveAsset} />} />
));

const SortableImages = ({ images, handleRemoveAsset, FormValues, setFormValues }) => {
    
    
    const [items, setItems] = useState([]);

    useEffect(() => {
        const updatedImageOrder = [...items];
        setFormValues({
                ...FormValues,
                imageOrder: updatedImageOrder
            })
    }, [items])

    useEffect(() => {
        let initialState = [];
        images.forEach((image, index) => {
            const imageFormatted = {
                src: image.file_url,
                imageId: image.id,
                width: 1,
                height: 1,
                category: 'old'
            }
            initialState.push(imageFormatted)
        })
        setItems(initialState)
    }, [images])

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMove(items, oldIndex, newIndex));
    };

    return (
        <div className="section-sortable-images">
            <SortableGallery items={items} onSortEnd={onSortEnd} axis={"xy"} handleRemoveAsset={handleRemoveAsset}/>
        </div>
    )
}

export default SortableImages;