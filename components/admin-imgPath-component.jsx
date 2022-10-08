import React from 'react';

const imgStyle = {
    width: '30em',
    border: '2px solid gray',
    borderRadius: '11px',
    margin: '1em auto',
};

const AdminShowImage = (props) => {
    const { record, property } = props;
    const imgpath = () => {
        return record.params.imagePath;
    };
    return (
        <div>
            <img style={imgStyle} src={imgpath()} alt="Product Image" />
        </div>
    );
};

export default AdminShowImage;
