export default function FilterBar({ filters, onChange, categories, statuses }) {
  return (
    <div className="glass-card rounded-3xl p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <input
          className="input-field"
          placeholder="Search by title, ward, or location"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
        />
        <select className="input-field" value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select className="input-field" value={filters.status} onChange={(e) => onChange('status', e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input
          className="input-field"
          placeholder="Filter by ward"
          value={filters.ward}
          onChange={(e) => onChange('ward', e.target.value)}
        />
      </div>
    </div>
  );
}
