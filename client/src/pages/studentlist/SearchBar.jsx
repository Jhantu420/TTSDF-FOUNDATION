

const SearchBar = ({ searchQuery, onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search by name, Registration no, mobile or Branch"
      value={searchQuery}
      onChange={(e) => onSearch(e.target.value)}
      className="w-90 md:w-220  p-4 m-4 border border-gray-900 rounded-md bg-gray-200 text-white"
    />
  );
};

export default SearchBar;
