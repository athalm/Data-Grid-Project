import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataGrid from "./components/DataGrid.tsx";

interface Person {
    id: number;
    firstName: string;
    lastName: string;
}

const App = () => {
    const [enabledEditing, setEnabledEditing] = useState(true);
    const [enableDownloadCSV, setEnableDownloadCSV] = useState(true);
    const [enableDownloadExcel, setEnableDownloadExcel] = useState(true);

    const data: Person[] = [
        { id: 1, firstName: 'A', lastName: 'B' },
        { id: 2, firstName: 'C', lastName: 'D' },
        { id: 1, firstName: 'A', lastName: 'B' },
        { id: 2, firstName: 'C', lastName: 'D' },
        { id: 1, firstName: 'A', lastName: 'B' },
        { id: 2, firstName: 'C', lastName: 'D' },
        { id: 1, firstName: 'A', lastName: 'B' },
        { id: 2, firstName: 'C', lastName: 'D' },
        { id: 1, firstName: 'A', lastName: 'B' },
        { id: 2, firstName: 'C', lastName: 'D' },
        { id: 1, firstName: 'A', lastName: 'B' },
        { id: 2, firstName: 'C', lastName: 'D' },
        { id: 1, firstName: 'A', lastName: 'B' },
        { id: 2, firstName: 'C', lastName: 'D' },
        { id: 1, firstName: 'A', lastName: 'B' },
        { id: 2, firstName: 'C', lastName: 'D' },
        { id: 1, firstName: 'A', lastName: 'B' },
        { id: 2, firstName: 'C', lastName: 'D' },

    ];

    const columns: ColumnDef<Person>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'firstName',
            header: 'First Name',
        },
        {
            accessorKey: 'lastName',
            header: 'Last Name',
        },
    ];

    return (
        <div className="App">
            <label>
                <input
                    type="checkbox"
                    checked={enabledEditing}
                    onChange={() => setEnabledEditing(!enabledEditing)}
                />
                Enable Editing
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={enableDownloadCSV}
                    onChange={() => setEnableDownloadCSV(!enableDownloadCSV)}
                />
                Enable Download CSV
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={enableDownloadExcel}
                    onChange={() => setEnableDownloadExcel(!enableDownloadExcel)}
                />
                Enable Download Excel
            </label>

            <DataGrid
                columns={columns}
                data={data}
                enabledEditing={enabledEditing}
                enableDownloadCSV={enableDownloadCSV}
                enableDownloadExcel={enableDownloadExcel}
            />
        </div>
    );
};

export default App;