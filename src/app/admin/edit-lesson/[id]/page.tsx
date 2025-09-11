'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebaseConfig'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function EditLessonPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [duration, setDuration] = useState('')

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const docRef = doc(db, 'lessons', id as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setTitle(data.title || '')
          setVideoUrl(data.videoUrl || '')
          setDuration(data.duration || '')
        }
      } catch (error) {
        console.error('Error fetching lesson:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchLesson()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateDoc(doc(db, 'lessons', id as string), {
        title,
        videoUrl,
        duration
      })
      router.push('/admin/manage-lessons')
    } catch (error) {
      console.error('Error updating lesson:', error)
    }
  }

  if (loading) return <p className="p-4">Loading lesson...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Lesson</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Lesson Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Video URL</Label>
          <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required />
        </div>
        <div>
          <Label>Duration</Label>
          <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 10:30" />
        </div>
        <Button type="submit">Update Lesson</Button>
      </form>
    </div>
  )
}
