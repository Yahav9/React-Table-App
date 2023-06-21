import { useEffect, useState } from 'react';
import { ColumnData } from '../../interfaces/ColumnData';
import './Filters.scss';

interface FiltersProps {
    columnsData: ColumnData[];
    onFilterChange: (activeFilters: string[]) => void
}

function Filters(props: FiltersProps) {
    const { columnsData, onFilterChange } = props;
    const [activeFilters, setActiveFilters] = useState<string[]>(columnsData.map(columnData => columnData.id));

    useEffect(() => {
        onFilterChange(activeFilters);
    }, [activeFilters]);

    const options = columnsData.map(columnData => {
        const changeHandler = () => {
            if (activeFilters.includes(columnData.id)) {
                setActiveFilters(prevActiveFilters => ([...prevActiveFilters].filter(activeFilter => {
                    return activeFilter !== columnData.id;
                })));
            } else {
                setActiveFilters(prevActiveFilters => ([...prevActiveFilters, columnData.id]));
            }
        }
        return (
            <label key={columnData.id}>
                <input
                    type="checkbox"
                    checked={activeFilters.includes(columnData.id)}
                    onChange={changeHandler}
                />
                {columnData.title}
            </label>
        )
    });

    return (
        <nav>
            <span>Show me the following columns: </span>
            {options}
        </nav>
    )
}

export default Filters;