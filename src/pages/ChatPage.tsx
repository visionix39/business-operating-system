import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { chatMessages, conversations } from '../data/mock'
import type { ChatMessage } from '../types'

export function ChatPage() {
  const { isHost, user } = useAuth()
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? '')
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(chatMessages)
  const [draft, setDraft] = useState('')
  const [mobileShowThread, setMobileShowThread] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const active = conversations.find((c) => c.id === activeId)
  const thread = messages[activeId] ?? []

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread, activeId])

  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim() || !activeId) return
    const msg: ChatMessage = {
      id: `local-${Date.now()}`,
      conversationId: activeId,
      senderId: 'me',
      senderName: user?.name ?? 'You',
      text: draft.trim(),
      timestamp: 'Just now',
      isMine: true,
    }
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), msg],
    }))
    setDraft('')

    // Simulated counterpart reply for demo feel
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `reply-${Date.now()}`,
        conversationId: activeId,
        senderId: isHost ? 'guest' : 'host',
        senderName: isHost ? 'Guest' : (active?.participantName ?? 'Host'),
        text: isHost
          ? 'Thanks for getting back to me — that works on our end.'
          : 'Got it — thanks for the update. Looking forward to hosting you.',
        timestamp: 'Just now',
        isMine: false,
      }
      setMessages((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), reply],
      }))
    }, 1200)
  }

  return (
    <div className="chat-layout">
      <aside className={`chat-list${mobileShowThread ? ' hidden-mobile' : ''}`}>
        <div className="chat-list-head">
          <h1>Messages</h1>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            {isHost ? 'Chat with guests about your listings' : 'Chat with hosts about your stays'}
          </p>
        </div>
        {conversations.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`chat-conv${activeId === c.id ? ' active' : ''}`}
            onClick={() => {
              setActiveId(c.id)
              setMobileShowThread(true)
            }}
          >
            <img src={c.participantAvatar} alt="" />
            <div style={{ minWidth: 0 }}>
              <h3>{c.participantName}</h3>
              <p>{c.lastMessage}</p>
            </div>
            <div>
              <span className="time">{c.lastTime}</span>
              {c.unread > 0 && <div className="unread-badge">{c.unread}</div>}
            </div>
          </button>
        ))}
      </aside>

      <section className={`chat-thread${!mobileShowThread ? ' hidden-mobile' : ''}`}>
        {active ? (
          <>
            <div className="chat-thread-head">
              <button
                type="button"
                className="btn btn-ghost btn-sm chat-back"
                onClick={() => setMobileShowThread(false)}
              >
                Back
              </button>
              <img src={active.participantAvatar} alt="" />
              <div>
                <h2>{active.participantName}</h2>
                <p>{active.propertyTitle}</p>
              </div>
            </div>
            <div className="chat-messages">
              {thread.map((m) => (
                <div key={m.id} className={`bubble ${m.isMine ? 'mine' : 'theirs'}`}>
                  {m.text}
                  <span className="stamp">{m.timestamp}</span>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form className="chat-compose" onSubmit={send}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                aria-label="Message"
              />
              <button type="submit" className="btn btn-primary btn-sm" aria-label="Send">
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </section>
    </div>
  )
}
