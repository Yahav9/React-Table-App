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
  const offset = useRef(10);
  const rowsData = useRef<RowData[]>([])

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
      })
    const filteredFetchedData = fetchedData.map(rowData => {
      const entries = Object.entries(rowData);
      const filteredEntries = entries.filter(entry => {
        for (const activeFilter of activeFilters.current) {
          if (entry.includes(activeFilter)) {
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

  const saveHandler = () => {
    localStorage.setItem(
      'rowsData',
      JSON.stringify(
        (JSON.parse(localStorage.getItem('rowsData')!) || []).concat(newRows.current)
      )
    );
  }

  const clearHandler = () => {
    localStorage.removeItem('rowsData');
    rowsData.current = [];
    newRows.current = [];
    setFilteredRowsData([]);
  }

  const createRowHandler = (newRow: RowData) => {
    rowsData.current.push(newRow);
    setFilteredRowsData(rowsData.current);
    newRows.current.push(newRow);
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
