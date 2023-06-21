import { useState } from 'react';
import { ColumnData } from '../../interfaces/ColumnData';
import './Table.scss';
import { RowData } from '../../interfaces/RowData';

interface TableProps {
    columnsData: ColumnData[];
    rowsData: RowData[];
    onRowCreation: (rowData: RowData) => void
}

function Table(props: TableProps) {
    const { columnsData, rowsData, onRowCreation } = props;
    const sortedColumnData = columnsData.sort((a: ColumnData, b: ColumnData) => {
        return a.ordinalNo - b.ordinalNo
    });

    let initialInputValues = {};
    for (const columnData of sortedColumnData) {
        initialInputValues = Object.assign(
            initialInputValues, { [columnData.id]: columnData.type === 'boolean' ? false : '' }
        )
    }
    const [inputValues, setInputValues] = useState(initialInputValues);

    const tableHeadings = sortedColumnData.map(columnData => {
        return (
            <th key={columnData.id} style={{ width: columnData.width }}>
                {columnData.title}
            </th>
        )
    });

    const tableInputs = sortedColumnData.map(columnData => {
        let inputType: string;
        if (columnData.type === 'string') {
            inputType = 'text';
        } else if (columnData.type === 'boolean') {
            inputType = 'checkbox';
        } else {
            inputType = columnData.type;
        }
        return (
            <td key={columnData.id} style={{ width: columnData.width }}>
                <input
                    type={inputType}
                    //@ts-ignore
                    value={columnData.type !== 'boolean' && inputValues[columnData.id]}
                    //@ts-ignore
                    checked={columnData.type === 'boolean' && inputValues[columnData.id]}
                    onChange={e => {
                        if (columnData.type !== 'boolean') {
                            setInputValues(currentData => ({ ...currentData, [columnData.id]: (e.target as HTMLInputElement).value }))
                        } else {
                            //@ts-ignore
                            setInputValues(currentData => ({ ...currentData, [columnData.id]: !inputValues[columnData.id] }));
                        }
                    }}
                />
            </td>
        )
    });

    const tableDataRows = rowsData.map(rowData => {
        const cells = Object.entries(rowData).slice(1).map(arr => {
            const width = columnsData.find(x => x.id === arr[0])?.width;
            return (
                <td
                    key={(Math.random() * 10000000).toString()}
                    style={{ width: width }}
                >
                    {arr[1]!.toString()}
                </td>
            )
        })
        return (
            <tr key={rowData.id}>
                {cells}
            </tr>
        )
    })

    const createRow = () => {
        const newRow = { id: (Math.random() * 10000000).toString(), ...inputValues }
        onRowCreation(newRow);
        setInputValues(initialInputValues);
    }

    const checkFormValidation = () => {
        for (const value of Object.values(inputValues)) {
            if (value!.toString() === '') {
                return true;
            }
        }
        return false;
    }
    return (
        <table>
            <thead>
                <tr>
                    {tableHeadings}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {tableInputs}
                    <td>
                        <button
                            disabled={checkFormValidation()}
                            onClick={createRow}>
                            ADD
                        </button>
                    </td>
                </tr>
                {tableDataRows}
            </tbody>
        </table>
    )
}

export default Table;