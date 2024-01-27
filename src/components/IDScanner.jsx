import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import ExtractedInfoTable from './ExtractedInfoTable';
import FileUploader from './FileUploader';
import ImageReviewer from './ImageReviewer';
import './styles.css';

const IDScanner = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [recognizedText, setRecognizedText] = useState('');
    const [tableData, setTableData] = useState([]);
    const [areCheckboxesChecked, setAreCheckboxesChecked] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            // Handle the case where no file is selected or the user cancels
            return;
        } else {
            setTableData([]);
            setRecognizedText('');
            setAreCheckboxesChecked(false);
        }
        const imageUrl = URL.createObjectURL(file); // Get the URL of the uploaded image
        setSelectedImage(imageUrl);

        Tesseract.recognize(
            file,
            'eng',
            { logger: (info) => console.log(info) }
        ).then(({ data: { text } }) => {
            setRecognizedText(text);
            // Extract information using regular expressions

            const nameRegex = /(?:Name|Full Name|Name\s*)(?::|\.|\s*)\s*([^\n]+)/i;
            const dobRegex = /(?:Date of Birth|DOB|D\.O\.B\.|D0B|D\.0\.B\.)(?::|\.|\s*)\s*([^\s]+)\s*([^\n]+)/i;
            const expiryRegex = /(?:Date of Expiry|Expiration Date|Expiry|Expires on)(?::|\.|\s*)\s*([^\s]+)\s*([^\n]+)/i;
            const nationalityRegex = /(?:Nationality|Country)(?::|\.|\s*)\s*([^\s]+)\s*([^\n]+)/i;
            const idNoRegex = /(?:ID. No|ID No|ID.No)(?::|\.|\s*)\s*([^\s]+)\s*([^\n]+)/i;

            const nameMatch = text.match(nameRegex);
            const dobMatch = text.match(dobRegex);
            const expiryMatch = text.match(expiryRegex);
            const nationalityMatch = text.match(nationalityRegex);
            const idNoMatch = text.match(idNoRegex);

            const extractedInfo = {
                Name: nameMatch ? nameMatch[1] : '',
                DateOfBirth: dobMatch ? dobMatch[1] : dobRegex.exec(text)?.[1] || '',
                ExpiryDate: expiryMatch ? expiryMatch[1] : expiryRegex.exec(text)?.[1] || '',
                Nationality: nationalityMatch ? nationalityMatch[1] : nationalityRegex.exec(text)?.[1] || '',
                IDNumber: idNoMatch ? idNoMatch[1] : idNoRegex.exec(text)?.[1] || '',
            };

            console.log('Extracted Information:', extractedInfo);

            setTableData(prevTableData => {
                // Check if the image already exists in tableData
                const existingIndex = prevTableData.findIndex(data => data.image === imageUrl);

                if (existingIndex !== -1) {
                    // If the image already exists, update its extractedInfo
                    const updatedTableData = [...prevTableData];
                    updatedTableData[existingIndex].extractedInfo = extractedInfo;
                    return updatedTableData;
                } else {
                    // If the image doesn't exist, add a new entry to tableData
                    return [...prevTableData, { image: imageUrl, extractedInfo }];
                }
            });
        });
    };

    const handleInputChange = (index, field, value) => {
        // Create a copy of the tableData array
        const updatedTableData = [...tableData];
        // Update the specific field in the corresponding object
        updatedTableData[index].extractedInfo[field] = value;
        // Update the state with the modified tableData
        setTableData(updatedTableData);
    };

    const handleCheckboxChange = () => {
        const allChecked = tableData.every(data => data.isChecked);
        setAreCheckboxesChecked(allChecked);
    };

    const handleCheckboxToggle = (index) => {
        const updatedTableData = [...tableData];
        updatedTableData[index].isChecked = !updatedTableData[index].isChecked;
        setTableData(updatedTableData);
        handleCheckboxChange();
    };

    const handleSubmit = () => {
        // Extract column headers from the first row
        const columnHeaders = Object.keys(tableData[0].extractedInfo);

        // Create CSV content
        const csvContent = `${columnHeaders.join(',')}\n` +
            tableData.map(data =>
                // Wrap each field in double quotes to handle special characters
                columnHeaders.map(header => `"${data.extractedInfo[header]}"`).join(',')
            ).join('\n');

        // Create a Blob with the CSV content
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(csvBlob);
        downloadLink.download = 'extracted_data.csv';

        // Append the link to the DOM and trigger the click event
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Remove the link from the DOM
        document.body.removeChild(downloadLink);
    };


    return (
        <div className="appCard">
            <div style={{ display: 'flex', width: '100%', justifyContent: selectedImage ? 'space-between' : 'center' }}>
                <FileUploader onChange={handleImageUpload} />
                <ImageReviewer selectedImage={selectedImage} />
            </div>

            <ExtractedInfoTable
                tableData={tableData}
                handleInputChange={handleInputChange}
                handleCheckboxToggle={handleCheckboxToggle}
            />
            <h4 style={{ display: selectedImage ? '' : 'none' }}>Scanned info from the image for your reference</h4>
            <p style={{ marginTop: '0' }}>{recognizedText}</p>
            <button
                className={`submitBtn ${areCheckboxesChecked ? '' : 'disabled'}`}
                onClick={handleSubmit}
                disabled={!areCheckboxesChecked}
            >
                Submit
            </button>
        </div>
    );
};

export default IDScanner;