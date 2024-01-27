import React from 'react';

const FileUploader = ({ onChange }) => (
    <div className="file-upload-container">
        <input type="file" id="fileInput" className="file-input" onChange={onChange} />
        <label htmlFor="fileInput" className="file-input-label">Upload your ID</label>
        <p className="upload-message">No file chosen</p>
        <p className="note-message">
            "Upload a high-resolution image and manually review and correct any text inconsistencies."
        </p>
    </div>
);

export default FileUploader;