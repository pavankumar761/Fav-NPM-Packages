
export const getFavorites = (): string[] => {
    const favoritesStr = localStorage.getItem('favorites');
    return favoritesStr ? JSON.parse(favoritesStr) : [];
  };
  
  export const addToFavorites = (packageName: string, reason: string): void => {
    const favorites = getFavorites();
    if (!favorites.includes(packageName)) {
      const newFavorites = [...favorites, packageName];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      addFavoriteReason(packageName, reason); 
    }
  };
  
  export const removeFromFavorites = (packageName: string): void => {
    const favorites = getFavorites();
    const newFavorites = favorites.filter((fav) => fav !== packageName);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  export const getFavoriteReason = (packageName: string): string | null => {
    const reason = localStorage.getItem(`favoriteReason_${packageName}`);
    return reason ? JSON.parse(reason) : null;
  };
  
  export const addFavoriteReason = (packageName: string, reason: string): void => {
    localStorage.setItem(`favoriteReason_${packageName}`, JSON.stringify(reason));
  };
  
  export const removeFavoriteReason = (packageName: string): void => {
    localStorage.removeItem(`favoriteReason_${packageName}`);
  };
  