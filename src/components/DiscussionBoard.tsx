import { useState } from 'react'
import { MessageCircle, Send, ThumbsUp, Reply } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface Comment {
    id: string
    author: string
    avatar: string
    content: string
    timestamp: string
    likes: number
    replies: Comment[]
}

const mockComments: Comment[] = [
    {
        id: '1',
        author: 'DealHunter99',
        avatar: 'D',
        content: 'Great deal! I bought one last week and it\'s been amazing. Highly recommend.',
        timestamp: '2 hours ago',
        likes: 12,
        replies: [
            {
                id: '1-1',
                author: 'BargainFinder',
                avatar: 'B',
                content: 'Same here! The quality is excellent for this price.',
                timestamp: '1 hour ago',
                likes: 5,
                replies: []
            }
        ]
    },
    {
        id: '2',
        author: 'SaverSam',
        avatar: 'S',
        content: 'Is this price available in-store or online only?',
        timestamp: '4 hours ago',
        likes: 3,
        replies: []
    }
]

export default function DiscussionBoard({ productId }: { productId: string }) {
    const { data: session, status } = useSession()
    const [comments, setComments] = useState<Comment[]>(mockComments)
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState('')

    const handleSubmitComment = () => {
        if (!newComment.trim()) return
        if (!session?.user?.id) {
            toast.error("Please sign in to post a comment")
            return
        }

        const comment: Comment = {
            id: Date.now().toString(),
            author: session.user.name || 'User',
            avatar: session.user.image || 'Y',
            content: newComment,
            timestamp: 'Just now',
            likes: 0,
            replies: []
        }
        setComments([comment, ...comments])
        setNewComment('')
        toast.success("Comment posted successfully!")
    }

    const handleSubmitReply = (parentId: string) => {
        if (!replyContent.trim()) return

        const reply: Comment = {
            id: `${parentId}-${Date.now()}`,
            author: 'You',
            avatar: 'Y',
            content: replyContent,
            timestamp: 'Just now',
            likes: 0,
            replies: []
        }

        setComments(comments.map(comment => {
            if (comment.id === parentId) {
                return { ...comment, replies: [...comment.replies, reply] }
            }
            return comment
        }))
        setReplyingTo(null)
        setReplyContent('')
    }

    const handleLike = (commentId: string) => {
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, likes: comment.likes + 1 }
            }
            return {
                ...comment,
                replies: comment.replies.map(reply =>
                    reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply
                )
            }
        }))
    }

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
        <div className={`${isReply ? 'ml-12 border-l-2 border-[var(--border-color)] pl-4' : ''}`}>
            <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] mb-3">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium text-sm">
                        {comment.avatar}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-[var(--text-primary)]">{comment.author}</p>
                        <p className="text-xs text-[var(--text-muted)]">{comment.timestamp}</p>
                    </div>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-4 mt-3">
                    <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-emerald-500 transition-colors"
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.likes}</span>
                    </button>
                    {!isReply && (
                        <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-emerald-500 transition-colors"
                        >
                            <Reply className="w-4 h-4" />
                            <span>Reply</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
                <div className="ml-12 mb-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className="input flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply(comment.id)}
                        />
                        <button
                            onClick={() => handleSubmitReply(comment.id)}
                            className="btn-primary px-4"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Replies */}
            {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply />
            ))}
        </div>
    )

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                    Discussion
                </h3>
                <span className="text-sm text-[var(--text-muted)]">
                    {comments.length} comments
                </span>
            </div>

            {/* Comment Form */}
            <div className="mb-6">
                {status === 'authenticated' ? (
                    <>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts about this product..."
                            className="input min-h-[100px] resize-none"
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                onClick={handleSubmitComment}
                                disabled={!newComment.trim()}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post Comment
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-6 text-center">
                        <p className="text-[var(--text-secondary)] mb-3">Sign in to join the discussion</p>
                        <a href="/login" className="btn-primary inline-flex">
                            Sign In / Sign Up
                        </a>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-2">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                ) : (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
