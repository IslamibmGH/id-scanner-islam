import React from 'react';

const ImageReviewer = ({ selectedImage }) => (
    <div className="imageReviewer">
        {selectedImage && <img src={selectedImage} alt="Uploaded ID" />}
    </div>
);

export default ImageReviewer;