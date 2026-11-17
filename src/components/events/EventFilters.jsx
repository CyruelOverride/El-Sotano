function Group({ label, value, options, onChange }) {
  return (
    <fieldset className="filters__group">
      <legend className="mono">{label}</legend>
      <div>
        {['', ...options].map((o) => (
          <button key={o || 'all'} type="button" className={`chip mono${value === o ? ' is-on' : ''}`} aria-pressed={value === o} onClick={() => onChange(o)}>
            {o || 'Todos'}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function EventFilters({ filters, options, onChange }) {
  return (
    <div className="filters">
      <Group label="Año" value={filters.year} options={options.years} onChange={(v) => onChange({ ...filters, year: v })} />
      <Group label="Categoría" value={filters.category} options={options.categories} onChange={(v) => onChange({ ...filters, category: v })} />
      <Group label="Tipo" value={filters.type} options={options.types} onChange={(v) => onChange({ ...filters, type: v })} />
    </div>
  );
}
