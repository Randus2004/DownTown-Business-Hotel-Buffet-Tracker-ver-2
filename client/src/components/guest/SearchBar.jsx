import "../../css/searchBar.css";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="🔍 Search Room No or Guest Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;