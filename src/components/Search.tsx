import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { getFavorites, addToFavorites as addToFavoritesStorage } from './storage';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [favoriteReason, setFavoriteReason] = useState('');
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const { data, isLoading, isError } = useQuery(
    ['search', searchTerm],
    () => axios.get(`https://api.npms.io/v2/search?q=${searchTerm}`),
    {
      enabled: !!searchTerm,
    }
  );

  const addToFavorites = async (packageName: string) => {
    try {
      const favorites: string[] = getFavorites();
      if (favorites.includes(packageName)) {
        return; // Already in favorites
      }

      // Set the selected package and ask for a reason
      setSelectedPackage(packageName);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const confirmAddToFavorites = async () => {
    try {
      if (selectedPackage) {
        setIsAddingToFavorites(true);

        // Update the favorites list
        addToFavoritesStorage(selectedPackage, favoriteReason); // <-- Include the reason argument
        // For demonstration purposes, you can make an API call to store the favorites on the server
        // Simulating an API call using a timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Clear the selected package and reason
        setSelectedPackage(null);
        setFavoriteReason('');
        setIsAddingToFavorites(false);
      }
    } catch (error) {
      console.error('Error confirming add to favorites:', error);
      setIsAddingToFavorites(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8 text-center">Search for NPM Packages</h2>
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search here for npm packages"
            className="p-4 border border-gray-600 rounded w-full focus:outline-none text-xl bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute top-0 right-0 m-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            onClick={() => setSearchTerm(searchTerm)}
          >
            Search
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-lg mb-8">Loading...</div>
        )}
        {isError && (
          <div className="text-center text-red-500 text-lg mb-8">Error fetching data</div>
        )}

        {data && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Search Results</h3>
            <ul className="divide-y divide-gray-600">
              {data.data.results.map((result: any) => (
                <li key={result.package.name} className="py-4">
                  <div className="flex items-center">
                    {/* <div className="flex-shrink-0">
                      <img src={result.package.links.npm} alt={result.package.name} className="h-10 w-10" />
                    </div> */}
                    <div className="ml-3">
                      <h3 className="text-xl font-bold">{result.package.name}</h3>
                      <p className="text-gray-300">{result.package.description}</p>
                      <button
                        onClick={() => addToFavorites(result.package.name)}
                        className="bg-white text-gray-700 px-4 py-2 rounded mt-2 hover:bg-gray-300 transition duration-300"
                      >
                        Add to Favorites
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal for adding to favorites with reason */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-gray-50 bg-opacity-70 flex justify-center items-center">
            <div className="bg-gray-800 p-4 rounded-md shadow-md">
              <p className="mb-4">
                Why is "{selectedPackage}" your favorite Package?
              </p>
              <textarea
                className="w-full p-2 border border-gray-600 rounded text-black mb-4"
                placeholder="Write your reason here"
                value={favoriteReason}
                onChange={(e) => setFavoriteReason(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={confirmAddToFavorites}
                  className={`bg-white text-gray-700 px-4 py-2 rounded mr-2 ${isAddingToFavorites ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 transition duration-300'}`}
                  disabled={isAddingToFavorites}
                >
                  Add to Favorites
                </button>
                <button
                  onClick={() => {
                    setSelectedPackage(null);
                    setFavoriteReason('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
