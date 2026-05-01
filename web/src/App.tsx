import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react'
import './App.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError(null)
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setError('Could not reach the server')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    sendMessage()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-layout">
      <div className="messages">
        {messages.length === 0 && (
          <p className="empty-state">Send a message to start chatting</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`bubble-row ${msg.role}`}>
            <div className="bubble">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="bubble-row assistant">
            <div className="bubble thinking">
              <span /><span /><span />
            </div>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form className="input-bar" onSubmit={handleSubmit}>
        <textarea
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Claude…"
          disabled={loading}
        />
        <button type="submit" disabled={!input.trim() || loading}>
          Send
        </button>
      </form>
    </div>
  )
}

export default App
