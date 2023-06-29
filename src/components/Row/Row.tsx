interface RowProps {
    children: (JSX.Element | null)[];
    id: string;
    onDelete: (rowId: string) => void;
}

function Row(props: RowProps) {
    const { children, id, onDelete } = props;

    return (
        <tr>
            {children}
            <td className='button-cell'>
                <button
                    onClick={() => onDelete(id)}
                    className='delete-button'
                >
                    <i className="material-icons"
                    >
                        delete
                    </i>
                </button>
            </td>
        </tr>
    )
}

export default Row;