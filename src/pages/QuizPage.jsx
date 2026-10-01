import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, RotateCcw } from 'lucide-react'
import { getQuizQuestions, quizLevels } from '../data/quizQuestions'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

const SESSION_SECONDS = 45 * 60

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${minutes}:${String(remaining).padStart(2, '0')}`
}

export function QuizPage() {
  const [session, setSession] = useState(null)
  const [position, setPosition] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [seconds, setSeconds] = useState(SESSION_SECONDS)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    if (!session || submitted || seconds <= 0) return undefined
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [session, submitted, seconds])

  useEffect(() => {
    if (session && seconds === 0 && !submitted) setSubmitted(true)
  }, [seconds, session, submitted])

  const questions = session?.questions || []
  const current = questions[position]
  const correct = useMemo(() => questions.filter((question) => answers[question.id] === question.answer).length, [answers, questions])
  const completed = Object.keys(answers).length
  const percentage = questions.length ? Math.round((correct / questions.length) * 100) : 0

  function startSession(level) {
    setSession({ level, questions: getQuizQuestions(level) })
    setPosition(0)
    setAnswers({})
    setSubmitted(false)
    setSeconds(SESSION_SECONDS)
    setShowReview(false)
  }

  function chooseAnswer(answer) {
    if (submitted || !current) return
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: answer }))
  }

  if (!session) {
    return (
      <div className="quiz-page space-y-6">
        <SectionHeader title="Solar Quiz" subtitle="Build practical solar knowledge from the same calculation and installation guidance used in the workspace." />
        <div className="quiz-level-grid grid gap-4 lg:grid-cols-3">
          {quizLevels.map((level) => (
            <Card key={level.id} className="quiz-level-card flex flex-col">
              <div className="quiz-level-meta"><span>50 questions</span><span>45 min</span></div>
              <h2 className="mt-2 font-heading text-2xl font-extrabold text-slate-950 dark:text-white">{level.label}</h2>
              <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500 dark:text-slate-400">{level.description}</p>
              <div className="quiz-level-detail mt-5"><Clock3 className="h-4 w-4" />Timed technical assessment</div>
              <Button className="mt-6 w-full" variant={level.id === 'intermediate' ? 'primary' : 'soft'} onClick={() => startSession(level.id)}>Start {level.label}</Button>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (submitted) {
    const mistakes = questions.filter((question) => answers[question.id] !== question.answer)
    return (
      <div className="quiz-page space-y-6">
        <SectionHeader title={`${session.level[0].toUpperCase()}${session.level.slice(1)} Quiz Results`} subtitle={seconds === 0 ? 'Time is up. Your answers have been submitted.' : 'Your answers have been submitted.'} />
        <div className="quiz-result-grid grid gap-4 sm:grid-cols-3">
          <Card className="stat-card"><div className="text-xs font-semibold text-slate-500">Score</div><div className="technical-value mt-1 font-heading text-3xl font-extrabold text-slate-950 dark:text-white">{correct} / 50</div></Card>
          <Card className="stat-card"><div className="text-xs font-semibold text-slate-500">Percentage</div><div className="technical-value mt-1 font-heading text-3xl font-extrabold text-sky-700 dark:text-sky-300">{percentage}%</div></Card>
          <Card className="stat-card"><div className="text-xs font-semibold text-slate-500">Incorrect</div><div className="technical-value mt-1 font-heading text-3xl font-extrabold text-slate-950 dark:text-white">{50 - correct}</div></Card>
        </div>
        <Card className="quiz-review-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-extrabold text-slate-950 dark:text-white">Review mistakes</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Each correction links the result back to the technical method used in the app.</p>
            </div>
            <Button variant="soft" onClick={() => setShowReview((currentValue) => !currentValue)}>{showReview ? 'Hide review' : `Review ${mistakes.length} mistakes`}</Button>
          </div>
          {showReview ? (
            <div className="mt-5 grid gap-4">
              {mistakes.length ? mistakes.map((question, index) => (
                <div key={question.id} className="quiz-review-item p-4">
                  <div className="text-xs font-semibold text-slate-400">Question {questions.indexOf(question) + 1}</div>
                  <div className="mt-2 font-bold text-slate-950 dark:text-white">{question.prompt}</div>
                  <div className="mt-3 text-sm text-red-600 dark:text-red-300">Your answer: {answers[question.id] || 'Not answered'}</div>
                  <div className="mt-1 text-sm font-semibold text-sky-700 dark:text-sky-300">Correct answer: {question.answer}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{question.explanation}</p>
                </div>
              )) : <div className="rounded-2xl bg-sky-50 p-4 text-sm text-sky-800 dark:bg-sky-400/10 dark:text-sky-200">Perfect score. You answered every question correctly.</div>}
            </div>
          ) : null}
        </Card>
        <Button variant="primary" onClick={() => startSession(session.level)}><RotateCcw className="h-4 w-4" />Try again</Button>
      </div>
    )
  }

  const selectedAnswer = answers[current.id]
  const progress = ((position + 1) / questions.length) * 100
  return (
    <div className="quiz-page space-y-5">
      <div className="quiz-session-head flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="quiz-session-title">
          <div className="text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">{session.level} level</div>
          <h1 className="mt-1 font-heading text-2xl font-extrabold text-slate-950 dark:text-white">Question {position + 1} of {questions.length}</h1>
        </div>
        <div className="quiz-timer inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"><Clock3 className="h-4 w-4 text-sky-600" />{formatTime(seconds)}</div>
      </div>
      <div className="quiz-progress-track h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10" aria-label={`${Math.round(progress)}% of quiz complete`}><div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${progress}%` }} /></div>
      <Card className="quiz-question-card">
        <div className="quiz-question-label">Choose the most accurate answer</div>
        <div className="font-heading text-xl font-extrabold leading-8 text-slate-950 dark:text-white">{current.prompt}</div>
        <div className="mt-6 grid gap-3">
          {current.options.map((option, optionIndex) => {
            const selected = selectedAnswer === option
            return <button key={option} type="button" onClick={() => chooseAnswer(option)} className={`quiz-answer min-h-14 px-4 py-3 text-left text-sm font-semibold ${selected ? 'quiz-answer-selected' : ''}`}>
              <span className="inline-flex items-center gap-3"><span className="quiz-answer-marker">{String.fromCharCode(65 + optionIndex)}</span><span className="flex-1">{option}</span>{selected ? <CheckCircle2 className="h-5 w-5 text-sky-600 dark:text-sky-300" /> : null}</span>
            </button>
          })}
        </div>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="soft" disabled={position === 0} onClick={() => setPosition((currentPosition) => Math.max(0, currentPosition - 1))}><ChevronLeft className="h-4 w-4" />Previous</Button>
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{completed} of 50 answered</div>
        {position === questions.length - 1 ? <Button variant="primary" onClick={() => setSubmitted(true)}>Submit Quiz</Button> : <Button variant="primary" onClick={() => setPosition((currentPosition) => Math.min(questions.length - 1, currentPosition + 1))}>Next<ChevronRight className="h-4 w-4" /></Button>}
      </div>
    </div>
  )
}
