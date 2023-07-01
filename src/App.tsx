import './App.scss';
import { ColumnData } from './interfaces/ColumnData';
import Table from './components/Table/Table';
import { useEffect, useState, useRef } from 'react';
import { RowData } from './interfaces/RowData';
import Filters from './components/Filters/Filters';
import tableColumns from './data/tableColumns';

function App() {
  const [filteredRowsData, setFilteredRowsData] = useState<RowData[]>([]);
  const [columnsData, setColumnsData] = useState<ColumnData[]>(tableColumns);
  const activeFilters = useRef<string[]>(columnsData.map(columnData => columnData.id));
  const newRows = useRef<RowData[]>([]);
  const updatedRows = useRef<RowData[]>([]);
  const deletedRowsIds = useRef<string[]>([]);
  const offset = useRef(10);
  const rowsData = useRef<RowData[]>([]);

  useEffect(() => {
    if (localStorage.getItem('rowsData')) {
      const fetchedData = (JSON.parse(localStorage.getItem('rowsData')!) as RowData[])
        .slice(0, 10);
      rowsData.current = fetchedData;
      setFilteredRowsData(fetchedData);
    }
  }, []);

  const loadData = () => {
    const fetchedData = (JSON.parse(localStorage.getItem('rowsData')!) as RowData[])
      .slice(offset.current, offset.current + 10)
      .filter(row => {
        return !rowsData.current.map(rowData => rowData.id).includes(row.id);
      });
    const filteredFetchedData = fetchedData.map(rowData => {
      const entries = Object.entries(rowData);
      const filteredEntries = entries.filter(([columnId]) => {
        return activeFilters.current.includes(columnId);
      });
      const filteredRowData: RowData = Object.assign(
        { id: entries[0][1] as string },
        Object.fromEntries(filteredEntries)
      );
      return filteredRowData;
    });
    rowsData.current = rowsData.current.concat(fetchedData);
    setFilteredRowsData(prevFilteredRowsData => ([...prevFilteredRowsData, ...filteredFetchedData]));
    offset.current += 10;
  }

  const filterChangeHandler = (filters: string[]) => {
    setColumnsData(tableColumns.filter(x => filters.includes(x.id)));
    setFilteredRowsData(rowsData.current.map(rowData => {
      const entries = Object.entries(rowData);
      const filteredEntries = entries.filter(entry => {
        for (const filter of filters) {
          if (entry.includes(filter)) {
            return true;
          }
        }
        return false;
      });
      const filteredRowData: RowData = Object.assign(
        { id: entries[0][1] as string },
        Object.fromEntries(filteredEntries)
      );
      return filteredRowData;
    }))
    activeFilters.current = filters;
  }

  const createRowHandler = (newRow: RowData) => {
    rowsData.current.push(newRow);
    setFilteredRowsData(rowsData.current);
    newRows.current.push(newRow);
  }

  const updateCell = (updatedCell: { rowId: string; columnId: string; value: unknown }) => {
    const unsavedRow = newRows.current.find(({ id }) => id === updatedCell.rowId);
    const updatedRow = updatedRows.current.find(({ id }) => updatedCell.rowId === id);
    if (unsavedRow) {
      unsavedRow[updatedCell.columnId] = updatedCell.value;
    } else if (updatedRow) {
      updatedRow[updatedCell.columnId] = updatedCell.value;
    } else {
      updatedRows.current.push({ id: updatedCell.rowId, [updatedCell.columnId]: updatedCell.value });
    }
  }

  const rowDeleteHandler = (rowId: string) => {
    setFilteredRowsData(prevFilteredRowsData => [...prevFilteredRowsData]
      .filter(({ id }) => id !== rowId));
    const indexOfUnsavedRow = newRows.current.findIndex(({ id }) => id === rowId);
    if (indexOfUnsavedRow >= 0) {
      newRows.current.splice(indexOfUnsavedRow, 1);
    } else {
      deletedRowsIds.current.push(rowId);
    }
  }

  const saveHandler = () => {
    if (!localStorage.getItem('rowsData')) {
      localStorage.setItem('rowsData', JSON.stringify(newRows.current));
      newRows.current = [];
    } else {
      const storedRowsData = JSON.parse(localStorage.getItem('rowsData')!) as RowData[];
      for (const updatedRow of updatedRows.current) {
        const index = storedRowsData.findIndex(({ id }) => updatedRow.id === id);
        storedRowsData[index] = Object.assign(
          storedRowsData.find(({ id }) => updatedRow.id === id)!,
          updatedRow
        );
      }
      localStorage.setItem(
        'rowsData',
        JSON.stringify(
          storedRowsData
            .filter(({ id }) => !deletedRowsIds.current.includes(id))
            .concat(newRows.current)
        )
      );
      newRows.current = [];
      updatedRows.current = [];
      deletedRowsIds.current = [];
    }
  }

  const clearHandler = () => {
    localStorage.removeItem('rowsData');
    rowsData.current = [];
    newRows.current = [];
    updatedRows.current = [];
    deletedRowsIds.current = [];
    setFilteredRowsData([]);
  }

  const sortTableRows = (columnId: string, order: string) => {
    if (order === 'ascend') {
      setFilteredRowsData(prevData => [...prevData]
        .sort((a, b) => (a[columnId] as string | number | boolean) > (b[columnId] as string | number | boolean) ? 1 : -1));
    } else if (order === 'descend') {
      setFilteredRowsData(prevData => [...prevData]
        .sort((a, b) => (a[columnId] as string | number | boolean) < (b[columnId] as string | number | boolean) ? 1 : -1));
    }
  }

  return (
    <div className="App">
      <Filters
        columnsData={tableColumns}
        onFilterChange={filterChangeHandler}
      />
      <Table
        columnsData={columnsData}
        rowsData={filteredRowsData}
        activeFilters={activeFilters.current}
        onRowCreation={createRowHandler}
        updateCell={updateCell}
        onRowDelete={rowDeleteHandler}
        sortRows={sortTableRows}
      />
      <div className='buttons'>
        <button
          onClick={saveHandler}
          className='save-button'
        > SAVE </button>
        <button
          onClick={loadData}
          className='load-button'
          disabled={localStorage.getItem('rowsData') === null || offset.current > JSON.parse(localStorage.getItem('rowsData')!).length}
        >
          LOAD MORE
        </button>
        <button
          className='clear-button'
          onClick={clearHandler}>
          CLEAR
        </button>
      </div>
    </div>
  );
}

export default App;
