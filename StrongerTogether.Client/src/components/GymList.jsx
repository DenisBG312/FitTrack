import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import Footer from "./Footer";

const GymList = () => {
    const [gyms, setGyms] = useState([]);
    const [selectedTown, setSelectedTown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const gymsPerPage = 9;
    const [totalGyms, setTotalGyms] = useState(0);
    const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
    const containerRef = useRef(null);

    const towns = [
        'Sofiya', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Pleven',
        'Sliven', 'Dobrich', 'Shumen', 'Yambol', 'Haskovo', 'Pernik', 'Asenovgrad'
    ];

    const townOptions = towns.map((town) => ({ value: town, label: town }));

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (!selectedTown) return;
    
        const fetchGyms = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `${API_URL}/Gyms/${selectedTown.toLowerCase()}?page=${currentPage}&pageSize=${gymsPerPage}`
                );
                if (!res.ok) {
                    throw new Error(`Failed to load gyms for ${selectedTown}`);
                }
                const data = await res.json();
                setGyms(data.gyms);
                setTotalGyms(data.totalGyms);
            } catch (err) {
                console.error("Error fetching gyms:", err);
                setError(err.message || "Failed to load gyms");
                setGyms([]);
                setTotalGyms(0);
            } finally {
                setLoading(false);
            }
        };
    
        // Add a small delay to show loading spinner (better UX)
        const timer = setTimeout(fetchGyms, 150);
        return () => clearTimeout(timer);
    }, [selectedTown, currentPage, API_URL]);

    const handleTownChange = (selectedOption) => {
        const newTown = selectedOption ? selectedOption.value : null;
        if (newTown === selectedTown) return;

        setCurrentPage(1);
        setSelectedTown(newTown);
        setGyms([]);
        setError(null);
    };

    const totalPages = Math.ceil(totalGyms / gymsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300
            }
        }
    };

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto mt-16 p-6 bg-gray-800 rounded-xl shadow-lg"
            >
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </motion.div>
                <div className="text-red-500 text-base mb-4 text-center font-medium">
                    {error}
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                        setError(null);
                        if (selectedTown) {
                            setCurrentPage(1);
                            setGyms([]);
                        }
                    }}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md text-sm"
                >
                    Try Again
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div 
            className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} relative`}
            ref={containerRef}
        >
            <div className="fixed inset-0 w-full h-full bg-black opacity-10 z-0"
                style={{ 
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    backgroundSize: "60px 60px",
                    backgroundRepeat: "repeat",
                    backgroundAttachment: "fixed"
                }}></div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 tracking-tight">
                        FitFinder Bulgaria
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Discover top-rated gyms in your town and start your fitness journey today
                    </p>
                </div>

                <div className="max-w-md mx-auto mb-16 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-yellow-400">Select Your Town</h2>
                    <Select
                        value={selectedTown ? { value: selectedTown, label: selectedTown } : null}
                        onChange={handleTownChange}
                        options={townOptions}
                        placeholder="Where are you located?"
                        className="w-full"
                        classNamePrefix="react-select"
                        isSearchable
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: "#2D3748",
                                borderRadius: "12px",
                                padding: "8px 12px",
                                backgroundColor: "#1A202C",
                                color: "white",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                zIndex: 10001,
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused ? "#ECC94B" : "#1A202C",
                                color: state.isFocused ? "#1A202C" : "#E2E8F0",
                                borderRadius: "4px",
                                padding: "10px 12px",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: "#ECC94B",
                                fontWeight: "600",
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: "#1A202C",
                                borderRadius: "12px",
                                border: "1px solid #2D3748",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
                                zIndex: 10002,
                                position: "absolute",
                            }),
                            menuList: (base) => ({ ...base, zIndex: 10002 }),
                            dropdownIndicator: (base) => ({
                                ...base,
                                color: "#ECC94B",
                            }),
                            input: (base) => ({
                                ...base,
                                color: "#E2E8F0",
                            }),
                        }}
                    />
                </div>

                <div className="mt-8">
                    {selectedTown === null ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 max-w-2xl mx-auto"
                        >
                            <motion.div 
                                className="animate-float inline-block mb-6"
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-yellow-400 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </motion.div>
                            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Choose a town to get started</h2>
                            <p className="text-gray-400">Select your town from the dropdown above to discover the best gyms in your area</p>
                        </motion.div>
                    ) : (
                        <>
                            <div className="flex items-center justify-center mb-12">
                                <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent w-full"></div>
                                <h2 className="text-3xl font-bold px-6 text-center text-yellow-400 whitespace-nowrap">
                                    Gyms in {selectedTown}
                                </h2>
                                <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent w-full"></div>
                            </div>

                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-center py-16"
                                    >
                                        <LoadingSpinner />
                                    </motion.div>
                                ) : gyms.length === 0 ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-yellow-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="text-xl font-semibold mb-2 text-yellow-400">No gyms found</h3>
                                        <p className="text-gray-400 max-w-md mx-auto">We couldn't find any gyms in {selectedTown}. Try selecting a different town or check back later.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="gyms"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="show"
                                        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                                    >
                                        {gyms.map((gym, index) => (
                                            <motion.a
                                                key={index}
                                                variants={itemVariants}
                                                href={gym.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-yellow-500/30 hover:scale-105 hover:-translate-y-1 flex flex-col"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50 z-10"></div>
                                                    <img
                                                        src={gym.imageUrl}
                                                        alt={gym.name}
                                                        className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.src = "https://cdn.oink.bg/assets/default_avatar_n.svg";
                                                        }}
                                                    />
                                                    <div className="absolute bottom-2 right-3 z-20 bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                                        {gym.rating}
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-yellow-400 transition-colors duration-300">{gym.name}</h3>
                                                    <div className="mt-auto pt-4 flex justify-between items-center">
                                                        <span className="inline-flex items-center text-sm font-medium text-gray-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {selectedTown}
                                                        </span>
                                                        <span className="text-yellow-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center">
                                                            View Details
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.a>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {totalPages > 1 && !loading && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-10 flex justify-center items-center gap-2 flex-wrap"
                                >
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-yellow-500 hover:text-gray-900'}`}
                                    >
                                        Previous
                                    </button>
                                    
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <motion.button
                                                key={pageNum}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => paginate(pageNum)}
                                                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${pageNum === currentPage ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white hover:bg-yellow-500 hover:text-gray-900'}`}
                                            >
                                                {pageNum}
                                            </motion.button>
                                        );
                                    })}

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-yellow-500 hover:text-gray-900'}`}
                                    >
                                        Next
                                    </button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default GymList;