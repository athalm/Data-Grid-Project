// src/components/DataGrid.tsx
import React, { useState, HTMLProps } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef
} from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/DataGrid.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Filter from './Filter';

interface DataGridProps<T extends object> {
    columns: ColumnDef<T>[];
    data: T[];
    enabledEditing?: boolean;
    enableDownloadCSV?: boolean;
    enableDownloadExcel?: boolean;
}

const IndeterminateCheckbox = ({
    indeterminate,
    className = '',
    ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    );
};

const DataGrid = <T extends object>({
    columns,
    data,
    enabledEditing = false,
    enableDownloadCSV = false,
    enableDownloadExcel = false,
}: DataGridProps<T>) => {
    const [tableData, setTableData] = useState<T[]>(data);
    const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string; originalValue: unknown } | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: tableData,
        columns,
        state: {
            rowSelection,
            globalFilter,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleSave = (rowIndex: number, columnId: string, value: unknown) => {
        if (editingCell && editingCell.originalValue !== value) {
            setTableData((oldData) =>
                oldData.map((row, index) => {
                    if (index === rowIndex) {
                        return {
                            ...row,
                            [columnId]: value,
                        };
                    }
                    return row;
                })
            );
        }
        setEditingCell(null);
    };

    const handleCancelEdit = () => {
        setEditingCell(null);
    };

    const handleDelete = (rowIndex: number) => {
        setTableData((oldData) => oldData.filter((_, index) => index !== rowIndex));
    };

    const copySelectedData = () => {
        const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
        const dataStr = JSON.stringify(selectedRows, null, 2);
        navigator.clipboard.writeText(dataStr).then(() => {
            alert("Selected data copied to clipboard");
        });
    };

    const promptFileName = (defaultName: string, extension: string) => {
        let fileName = prompt("Enter file name:", defaultName);
        if (fileName) {
            if (!fileName.endsWith(extension)) {
                fileName += extension;
            }
        } else {
            fileName = defaultName;
        }
        return fileName;
    };

    const downloadCSV = () => {
        const fileName = promptFileName('data.csv', '.csv');
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        const csvOutput = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
        const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, fileName);
    };

    const downloadExcel = () => {
        const fileName = promptFileName('data.xlsx', '.xlsx');
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        const excelOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelOutput], { type: 'application/octet-stream' });
        saveAs(blob, fileName);
    };

    const downloadSelectedCSV = () => {
        const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
        const fileName = promptFileName('selected_data.csv', '.csv');
        const worksheet = XLSX.utils.json_to_sheet(selectedRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Data");
        const csvOutput = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
        const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, fileName);
    };

    const downloadSelectedExcel = () => {
        const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
        const fileName = promptFileName('selected_data.xlsx', '.xlsx');
        const worksheet = XLSX.utils.json_to_sheet(selectedRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Data");
        const excelOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelOutput], { type: 'application/octet-stream' });
        saveAs(blob, fileName);
    };

    const toggleAllRowsSelected = () => {
        const allSelected = Object.keys(rowSelection).length === tableData.length;
        if (allSelected) {
            setRowSelection({});
        } else {
            const newSelection = {};
            tableData.forEach((_, index) => {
                newSelection[index] = true;
            });
            setRowSelection(newSelection);
        }
    };

    return (
        <div className="table-container">
            <input
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search"
            />
            <div className="download-buttons">
                {enableDownloadCSV && <button onClick={downloadCSV}>Download CSV</button>}
                {enableDownloadExcel && <button onClick={downloadExcel}>Download Excel</button>}
                <button onClick={copySelectedData}>Copy Selected Data</button>
                <button onClick={downloadSelectedCSV}>Download Selected CSV</button>
                <button onClick={downloadSelectedExcel}>Download Selected Excel</button>
            </div>
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            <th>
                                <IndeterminateCheckbox
                                    {...{
                                        checked: table.getIsAllRowsSelected(),
                                        indeterminate: table.getIsSomeRowsSelected(),
                                        onChange: toggleAllRowsSelected,
                                    }}
                                />
                            </th>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder ? null : (
                                        <>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            <Filter column={header.column} table={table} />
                                        </>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            <td>
                                <IndeterminateCheckbox
                                    {...{
                                        checked: row.getIsSelected(),
                                        indeterminate: row.getIsSomeSelected(),
                                        onChange: row.getToggleSelectedHandler(),
                                    }}
                                />
                            </td>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {editingCell && editingCell.rowId === row.id && editingCell.columnId === cell.column.id ? (
                                        <input
                                            type="text"
                                            defaultValue={cell.getValue() as string}
                                            onBlur={(e) => handleSave(row.index, cell.column.id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSave(row.index, cell.column.id, (e.target as HTMLInputElement).value);
                                                } else if (e.key === 'Escape') {
                                                    handleCancelEdit();
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div
                                            onDoubleClick={() => enabledEditing && setEditingCell({ rowId: row.id, columnId: cell.column.id, originalValue: cell.getValue() })}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    )}
                                </td>
                            ))}
                            <td>
                                <button className="icon-button" onClick={() => handleDelete(row.index)}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        style={{ width: '50px' }}
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default DataGrid;