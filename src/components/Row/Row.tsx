interface RowProps {
    children: (JSX.Element | null)[]

}

function Row(props: RowProps) {
    const { children } = props;

    return (
        <tr>
            {children}
            <td className='button-cell'>
                <button
                    onClick={() => console.log('clicked')}
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