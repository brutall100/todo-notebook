import PropTypes from 'prop-types'

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

// An avatar drawn from initials — no real photos
function Avatar({ name }) {
  return (
    <svg className="avatar" viewBox="0 0 40 40" role="img" aria-label={`${name} avatar`}>
      <circle cx="20" cy="20" r="18" strokeWidth="2" style={{ fill: 'var(--highlight)', stroke: 'var(--outline)' }} />
      <text
        x="20"
        y="25.5"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        style={{ fill: 'var(--outline)', fontFamily: 'var(--font-body)' }}
      >
        {initialsOf(name)}
      </text>
    </svg>
  )
}

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
}

export default Avatar
