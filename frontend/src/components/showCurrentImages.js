import React from 'react';
const API_ROOT_URL = process.env.API_ROOT_URL || 'http://localhost:3002';

const ShowCurrentImages = ({ images }) => {
    const renderImages = images.map((x, i) => (
        <li key={x._id ? x._id : i}>
            <div className='image'>
                <img src={`${API_ROOT_URL}${x.path}`} alt={x.name} />
            </div>

            <h3>{x.name}</h3>
        </li>
    ));

    return <ul className='image_wrapper'>{renderImages}</ul>;
};

export default ShowCurrentImages;
