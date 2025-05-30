import { CircleArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <button
            onClick={handleGoBack}
            className="px-4 py-2 text-white rounded hover:bg-[#00000077]"
        >
            <CircleArrowLeft color="#f39c12" size={30} />
        </button>
    );
};

export default BackButton;
