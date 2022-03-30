const FormatOptionLabel = ({ value, label, type }) => (
    <div style={{ display: 'flex' }}>
        {type === 'user' ? <div>{label}&nbsp;</div> : <div />}
        <div style={{ 'font-weight': 'bold' }}>{type === 'user' ? '@' : 'r/'}{value}</div>
    </div>
)

export default FormatOptionLabel
