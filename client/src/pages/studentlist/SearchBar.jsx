const SearchBar = ({ searchQuery, onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search by name, Registration no, mobile or Branch"
      value={searchQuery}
      onChange={(e) => onSearch(e.target.value)}
      className="md:w-[520px]  p-2 m-4 border border-gray-900 rounded-md bg-gray-200 "
    />
  );
};

export default SearchBar;
