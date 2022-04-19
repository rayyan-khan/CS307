const FormatOptionLabel = ({ value, label, type }) => (
    <div style={{ display: 'flex', wordBreak: 'break-all' }}>
        {type === 'user' ? <div>{label}&nbsp;</div> : <div />}
        <div style={{ 'font-weight': 'bold', wordBreak: 'break-all' }}>
            {type === 'user' ? '@' : 'r/'}
            {value}
        </div>
    </div>
)

export default FormatOptionLabel
