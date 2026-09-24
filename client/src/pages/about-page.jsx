import { useEffect } from 'react'
import Reveal from '../components/reveal.jsx'
import { isDemo } from '../api/index.js'

const CARDS = [
  {
    title: 'What it is',
    body: (
      <>
        <p>
          Todo Notebook is a task manager that looks and feels like a paper notebook: sticky notes, ruled
          pages and a red margin line.
        </p>
        <p>Each person has their own account and only sees their own tasks.</p>
      </>
    ),
  },
  {
    title: 'What you can do',
    body: (
      <ul>
        <li>Add, edit and delete tasks</li>
        <li>Tick tasks off and see your progress</li>
        <li>Sort tasks into Work, Home, Study and Errands</li>
        <li>Filter by status or category</li>
        <li>Switch between light and dark mode</li>
      </ul>
    ),
  },
  {
    title: 'How it is built',
    body: (
      <ul>
        <li>React + Vite on the front end</li>
        <li>Express REST API with JWT login</li>
        <li>MongoDB with Mongoose</li>
        <li>Passwords hashed with bcrypt</li>
      </ul>
    ),
  },
  {
    title: isDemo ? 'You are in demo mode' : 'You are in server mode',
    body: isDemo ? (
      <p>
        This copy runs without a server, so tasks are stored in your browser. Run the project locally with
        the Express API to get real accounts and a database.
      </p>
    ) : (
      <p>This copy is connected to the Express API, so your tasks are saved in MongoDB.</p>
    ),
  },
]

function AboutPage() {
  useEffect(() => {
    document.title = 'About — Todo Notebook'
    return () => {
      document.title = 'Todo Notebook — a paper to-do list with accounts'
    }
  }, [])

  return (
    <div className="container about">
      <section className="hero" style={{ paddingBottom: 0 }}>
        <p className="hand hero__kicker">the story behind the page</p>
        <h1 className="hero__title">
          About the <mark>notebook</mark>
        </h1>
      </section>
      <div className="about__grid">
        {CARDS.map((card, index) => (
          <Reveal key={card.title} className="card" delay={index * 90}>
            <h2>{card.title}</h2>
            {card.body}
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default AboutPage
