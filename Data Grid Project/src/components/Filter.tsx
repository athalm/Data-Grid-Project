// src/components/Filter.tsx
import React from 'react';
import { Column, Table } from '@tanstack/react-table';

interface FilterProps {
  column: Column<unknown, unknown>;
  table: Table<unknown>;
}

const Filter: React.FC<FilterProps> = ({ column, table }) => {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={((column.getFilterValue() as unknown)?.[0] ?? '') as string}
        onChange={e => column.setFilterValue((old: unknown) => [e.target.value, old?.[1]])}
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={((column.getFilterValue() as unknown)?.[1] ?? '') as string}
        onChange={e => column.setFilterValue((old: unknown) => [old?.[0], e.target.value])}
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
};

export default Filter;