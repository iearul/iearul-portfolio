import { useState } from 'react'
import { api } from '../../../lib/api'
import { useGame } from '../../../store/game'
import { PROFILE } from '../../../data/profile'
import { PanelHeader } from './common'
import { Icon } from '../Icon'

export function ContactLinks() {
  return (
    <div className="contact-links">
      <a href={`mailto:${PROFILE.email}`}>
        <Icon name="mail" size={16} /> {PROFILE.email}
      </a>
      <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
        <Icon name="linkedin" size={16} /> LinkedIn
      </a>
      <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
        <Icon name="github" size={16} /> GitHub
      </a>
    </div>
  )
}

export function ContactPanel() {
  const award = useGame((s) => s.award)
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [state, setState] = useState({ status: 'idle', errors: {}, message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setState({ status: 'sending', errors: {}, message: '' })
    try {
      await api.sendMessage(form)
      setState({ status: 'sent', errors: {}, message: '' })
      award('message:sent', 150, 'Letter sent! Thanks for writing.')
    } catch (err) {
      setState({
        status: 'error',
        errors: err.errors || {},
        message:
          err.status === 422
            ? 'Please check the highlighted fields.'
            : err.status === 429
              ? 'Too many letters at once. Try again in a minute.'
              : 'The mail boat is not answering right now. Email me directly instead.',
      })
    }
  }

  const fieldError = (k) => state.errors[k]?.[0]

  return (
    <>
      <PanelHeader kicker="Mailbox" title="Send me a letter" sub="Job offers, project ideas or just hello. I read every message." />
      {state.status === 'sent' ? (
        <div className="sent">
          <div className="sent-flag" aria-hidden>
            <Icon name="check" size={28} />
          </div>
          <p>Your letter is on its way. I will get back to you by email.</p>
        </div>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
          <label>
            Name
            <input value={form.name} onChange={set('name')} required maxLength={120} autoComplete="name" aria-invalid={!!fieldError('name')} />
            {fieldError('name') && <span className="field-error">{fieldError('name')}</span>}
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={set('email')} required maxLength={190} autoComplete="email" aria-invalid={!!fieldError('email')} />
            {fieldError('email') && <span className="field-error">{fieldError('email')}</span>}
          </label>
          <label>
            Message
            <textarea value={form.message} onChange={set('message')} required minLength={10} maxLength={5000} rows={5} aria-invalid={!!fieldError('message')} />
            {fieldError('message') && <span className="field-error">{fieldError('message')}</span>}
          </label>
          <label className="hp" aria-hidden>
            Website
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
          </label>
          {state.message && <p className="form-error">{state.message}</p>}
          <button type="submit" className="primary-btn" disabled={state.status === 'sending'}>
            {state.status === 'sending' ? 'Sending…' : 'Send letter'}
          </button>
        </form>
      )}
      <ContactLinks />
    </>
  )
}
