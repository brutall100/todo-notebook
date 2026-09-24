import PropTypes from 'prop-types'
import { useCountUp } from '../hooks/use-count-up.js'

function Stat({ label, value }) {
  const shown = useCountUp(value)
  return (
    <div className="stat">
      <span className="stat__value">{shown}</span>
      <span className="stat__label">{label}</span>
    </div>
  )
}

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

function TaskStats({ tasks }) {
  const total = tasks.length
  const done = tasks.filter((task) => task.done).length
  const percent = total ? Math.round((done / total) * 100) : 0
  const shownPercent = useCountUp(percent)

  return (
    <section className="stats" aria-label="Progress">
      <Stat label="Tasks" value={total} />
      <Stat label="Done" value={done} />
      <Stat label="Left" value={total - done} />
      <div className="progress">
        <div className="progress__label">
          <span id="progress-label">Page finished</span>
          <span>{shownPercent}%</span>
        </div>
        <div
          className="progress__track"
          role="progressbar"
          aria-labelledby="progress-label"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="progress__fill" style={{ '--progress': percent / 100 }} />
        </div>
      </div>
    </section>
  )
}

TaskStats.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({ done: PropTypes.bool.isRequired })).isRequired,
}

export default TaskStats
