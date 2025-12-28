import React from 'react'
import { use } from 'react';

const EditCategory = ({ params }) => {
    const { id } = use(params);
    return (
        <div>EditCategory</div>
    )
}

export default EditCategory