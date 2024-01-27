import React from 'react';

const ExtractedInfoTable = ({ tableData, handleInputChange, handleCheckboxToggle }) => (
    <table>
        <thead>
            <h4 style={{ display: tableData === '' ? '' : 'none' }}>Extracted ID Information</h4>
        </thead>
        <tbody>
            {tableData.map((data, index) => (
                <React.Fragment key={index}>
                    <tr>
                        <td className="label">Name</td>
                        <td><input type="text" value={data.extractedInfo.Name} onChange={(e) => handleInputChange(index, 'Name', e.target.value)} className="input-field" /></td>
                    </tr>
                    <tr>
                        <td className="label">Date of Birth</td>
                        <td><input type="text" value={data.extractedInfo.DateOfBirth} onChange={(e) => handleInputChange(index, 'DateOfBirth', e.target.value)} className="input-field" /></td>
                    </tr>
                    <tr>
                        <td className="label">Date of Expiry</td>
                        <td><input type="text" value={data.extractedInfo.ExpiryDate} onChange={(e) => handleInputChange(index, 'ExpiryDate', e.target.value)} className="input-field" /></td>
                    </tr>
                    <tr>
                        <td className="label">Nationality</td>
                        <td><input type="text" value={data.extractedInfo.Nationality} onChange={(e) => handleInputChange(index, 'Nationality', e.target.value)} className="input-field" /></td>
                    </tr>
                    <tr>
                        <td className="label">ID Number</td>
                        <td><input type="text" value={data.extractedInfo.IDNumber} onChange={(e) => handleInputChange(index, 'IDNumber', e.target.value)} className="input-field" /></td>
                    </tr>
                    <tr>
                        <td className="label" style={{ paddingTop: '20px', fontStyle: 'italic', color: '#555' }}>
                            I confirm the accuracy of the data</td>
                        <td style={{ paddingTop: '20px' }}>
                            <input
                                type="checkbox"
                                checked={data.isChecked}
                                onChange={() => handleCheckboxToggle(index)}
                            />
                        </td>
                    </tr>
                </React.Fragment>
            ))}
        </tbody>
    </table>
);

export default ExtractedInfoTable;
