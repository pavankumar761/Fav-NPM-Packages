import React, { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import {
  removeFromFavorites,
  getFavorites,
  addToFavorites as addToFavoritesStorage,
  getFavoriteReason,
  addFavoriteReason,
  removeFavoriteReason,
} from './storage';

const Favorites = () => {
  const [removeConfirmation, setRemoveConfirmation] = useState<string | null>(null);
  const [editPackage, setEditPackage] = useState<string | null>(null);
  const [editedReason, setEditedReason] = useState<string>('');
  const [viewReasonPackage, setViewReasonPackage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const favorites: string[] = getFavorites();

  const removeFromFavoritesHandler = (packageName: string) => {
    setRemoveConfirmation(packageName);
  };

  const editFavoriteReason = (packageName: string) => {
    setEditPackage(packageName);
    setEditedReason(getFavoriteReason(packageName) || '');
  };

  const saveEditedReason = () => {
    if (editPackage) {
      addFavoriteReason(editPackage, editedReason);
      queryClient.invalidateQueries('favorites');
      setEditPackage(null);
    }
  };

  const viewFavoriteReason = (packageName: string) => {
    setViewReasonPackage(packageName);
  };

  const confirmRemoveFromFavorites = async () => {
    try {
      if (removeConfirmation) {
        const confirmation = window.confirm(`Remove ${removeConfirmation} from favorites?`);

        if (confirmation) {
          removeFromFavorites(removeConfirmation);
          removeFavoriteReason(removeConfirmation);
          queryClient.invalidateQueries('favorites');
          setRemoveConfirmation(null);
        }
      }
    } catch (error) {
      console.error('Error confirming remove from favorites:', error);
    }
  };

  useEffect(() => {
    const fetchFavoriteReasons = async () => {
      for (const packageName of favorites) {
        const reason = await getFavoriteReason(packageName);
        console.log(`Reason for ${packageName}: ${reason}`);
      }
    };

    fetchFavoriteReasons();
  }, [favorites]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-white-500">Your Favorites</h2>
      {favorites.length === 0 && <p className="text-center text-gray-500">No favorites yet.</p>}
      {favorites.length > 0 && (
        <table className="min-w-full max-w-md bg-gray-800 rounded overflow-hidden">
          <thead>
            <tr>
              <th className="text-left py-2 px-4">Package Name</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((packageName) => (
              <tr key={packageName} className="hover:bg-gray-700">
                <td className="py-2 px-4">{packageName}</td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    {editPackage === packageName ? (
                      <>
                        <button
                          onClick={saveEditedReason}
                          className="text-green-500 border border-black px-4 py-2 rounded text-black"
                          title="Save"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditPackage(null)}
                          className="text-gray-500 border border-black px-4 py-2 rounded text-black"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => viewFavoriteReason(packageName)}
                          className="text-purple-500 border border-white px-4 py-2 rounded text-white"
                          title="View Reason"
                        >
                          View
                        </button>
                        <button
                          onClick={() => editFavoriteReason(packageName)}
                          className="text-blue-500 border border-white px-4 py-2 rounded text-white"
                          title="Edit Reason"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeFromFavoritesHandler(packageName)}
                          className="text-red-500 border border-white px-4 py-2 rounded text-white"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {removeConfirmation && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-70 flex justify-center items-center">
          <div className="bg-gray-700 p-4 rounded-md shadow-md">
            <p>
              Are you sure you want to remove {removeConfirmation} from favorites?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={confirmRemoveFromFavorites}
              >
                Remove
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setRemoveConfirmation(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editPackage && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-70 flex justify-center items-center">
          <div className="bg-gray-700 p-8 rounded-md shadow-md">
            <p className="text-xl font-bold mb-4">Edit Reason for marking "{editPackage}" as your favorite</p>
            <textarea
              className="w-full h-32 p-2 border rounded-md mb-4 text-black"
              value={editedReason}
              onChange={(e) => setEditedReason(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="text-purple-500 border border-white px-4 py-2 rounded text-white"
                onClick={saveEditedReason}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {viewReasonPackage && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-70 flex justify-center items-center">
          <div className="bg-gray-700 p-8 rounded-md shadow-md">
            <p className="text-xl font-bold mb-4">Reason for marking "{viewReasonPackage}" as your favorite</p>
            <p className="text-white">{getFavoriteReason(viewReasonPackage)}</p>
            
            <div className="flex justify-end mt-4">
              <button
                className="text-purple-500 border border-white px-4 py-2 rounded text-white"
                onClick={() => setViewReasonPackage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
