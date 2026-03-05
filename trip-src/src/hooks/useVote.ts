import { useState, useEffect, useCallback } from 'react'

const GAS_URL = '__GAS_URL__' // will be replaced with actual GAS deployment URL

export interface VoteRecord {
  name: string
  mainCourse: string
  dessert: string
  drink: string
  timestamp: string
}

export function useVote() {
  const [votes, setVotes] = useState<VoteRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVotes = useCallback(async () => {
    if (GAS_URL === '__GAS_URL__') {
      // Demo mode: use localStorage
      const stored = localStorage.getItem('trip-votes')
      if (stored) setVotes(JSON.parse(stored))
      return
    }
    setLoading(true)
    try {
      const res = await fetch(GAS_URL)
      const data = await res.json()
      setVotes(data.votes || [])
    } catch {
      setError('無法載入投票結果')
    } finally {
      setLoading(false)
    }
  }, [])

  const submitVote = useCallback(async (vote: Omit<VoteRecord, 'timestamp'>) => {
    setSubmitting(true)
    setError(null)
    try {
      if (GAS_URL === '__GAS_URL__') {
        // Demo mode: use localStorage
        const stored = localStorage.getItem('trip-votes')
        const existing: VoteRecord[] = stored ? JSON.parse(stored) : []
        const idx = existing.findIndex(v => v.name === vote.name)
        const record = { ...vote, timestamp: new Date().toISOString() }
        if (idx >= 0) existing[idx] = record
        else existing.push(record)
        localStorage.setItem('trip-votes', JSON.stringify(existing))
        setVotes(existing)
        return true
      }
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify(vote),
      })
      const data = await res.json()
      if (data.success) {
        await fetchVotes()
        return true
      }
      setError(data.error || '投票失敗')
      return false
    } catch {
      setError('網路錯誤，請稍後再試')
      return false
    } finally {
      setSubmitting(false)
    }
  }, [fetchVotes])

  useEffect(() => {
    fetchVotes()
  }, [fetchVotes])

  return { votes, loading, submitting, error, submitVote, fetchVotes }
}
