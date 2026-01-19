import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from '../firebase'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit, deleteDoc, doc } from 'firebase/firestore'

export default function SupporterBoard({ isAdmin }) {
    const [messages, setMessages] = useState([])
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [myMessages, setMyMessages] = useState(() => {
        const saved = localStorage.getItem('my_messages')
        return saved ? JSON.parse(saved) : []
    })
    const messagesEndRef = useRef(null)

    // Subscribe to messages
    useEffect(() => {
        const q = query(
            collection(db, 'supporters'),
            orderBy('timestamp', 'desc'),
            limit(50)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setMessages(msgs)
        }, (err) => {
            console.error("Error fetching messages:", err)
            setError("Failed to load messages.")
        })

        return () => unsubscribe()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim() || !message.trim()) return

        setIsSubmitting(true)
        setError(null)

        try {
            const docRef = await addDoc(collection(db, 'supporters'), {
                name: name.trim(),
                message: message.trim(),
                timestamp: serverTimestamp()
            })

            // Save to my messages
            const newMyMessages = [...myMessages, docRef.id]
            setMyMessages(newMyMessages)
            localStorage.setItem('my_messages', JSON.stringify(newMyMessages))

            setMessage('') // Keep name for convenience
        } catch (err) {
            console.error("Error adding message:", err)
            setError("Failed to post message. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (msgId) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return
        try {
            await deleteDoc(doc(db, 'supporters', msgId))
        } catch (err) {
            console.error("Error deleting message:", err)
            alert("Failed to delete message.")
        }
    }

    return (
        <div className="supporter-board">
            <div className="board-header">
                <h3>📢 Supporter Board</h3>
                <p>Cheer for Melvin!</p>
            </div>

            <div className="messages-container">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            className="message-item"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            <div className="message-header">
                                <div className="message-info">
                                    <span className="message-author">{msg.name}</span>
                                    {msg.timestamp && (
                                        <span className="message-time">
                                            {new Date(msg.timestamp?.toDate()).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                {(isAdmin || myMessages.includes(msg.id)) && (
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="delete-msg-btn"
                                        title="Delete Message"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            lineHeight: 1
                                        }}
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                            <p className="message-content">{msg.message}</p>
                        </motion.div>
                    ))}
                    {messages.length === 0 && !error && (
                        <div className="empty-board">
                            <p>Be the first to leave a message!</p>
                        </div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            <form className="message-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={20}
                        required
                        className="board-input"
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Write a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={140}
                        required
                        className="board-textarea"
                        rows={2}
                    />
                </div>
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting || !name.trim() || !message.trim()}
                >
                    {isSubmitting ? 'Posting...' : 'Post Message'}
                </button>
            </form>
        </div>
    )
}
