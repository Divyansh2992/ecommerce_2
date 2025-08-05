import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SortOptions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get('sortBy') || '';

    const handleSortChange = (e) => {
        const newSortBy = e.target.value;
        const newParams = new URLSearchParams(searchParams.toString());
        if (newSortBy) {
            newParams.set('sortBy', newSortBy);
        } else {
            newParams.delete('sortBy');
        }
        setSearchParams(newParams);
    };

    return (
        <div className='mb-4 flex items-center justify-end'>
            <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className='border p-2 rounded-md focus:outline-none'
            >
                <option value="">Default</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
            </select>
        </div>
    );
}

export default SortOptions;
