const FormatOptionLabel = ({ value, label }) => (
    <div style={{ display: 'flex' }}>
        <div>{label}&nbsp;</div>
        <div style={{ 'font-weight': 'bold' }}>@{value}</div>
    </div>
)

export default FormatOptionLabel
