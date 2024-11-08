"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePlus, Loader2, Lock } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { Progress } from "@/components/ui/progress"
import { useRouter } from 'next/navigation'

interface ImageUploadProps {
  onSuccess?: () => void
}

export function ImageUpload({ onSuccess }: ImageUploadProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()
  }, [supabase.auth])

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file || !title) return
    
    try {
      setUploading(true)
      setUploadProgress(0)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const options = {
        cacheControl: '3600',
        upsert: false,
        onProgress: (progress: { transferred: number; total: number }) => {
          if (progress.total) {
            const percent = (progress.transferred / progress.total) * 100
            setUploadProgress(Math.min(percent, 99))
          }
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('carousel-images')
        .upload(fileName, file, options)

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`)
      }

      setUploadProgress(100)

      const { data } = await supabase.storage
        .from('carousel-images')
        .getPublicUrl(fileName)

      if (!data?.publicUrl) {
        throw new Error('Failed to get public URL')
      }

      const { error: dbError } = await supabase
        .from('carousel_items')
        .insert({
          title,
          imageUrl: data.publicUrl,
          likes: 0
        })

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      setTitle('')
      setFile(null)
      setPreview(null)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error uploading:', error)
    } finally {
      setUploading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">Authentication Required</h3>
          <p className="text-sm text-muted-foreground">
            Please sign in to upload images
          </p>
        </div>
        <Button onClick={() => router.push('/auth/login')}>
          Sign In with GitHub
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter image title"
          disabled={uploading}
        />
      </div>
      
      <div className="space-y-2">
        {!preview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <Label 
              htmlFor="image" 
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <ImagePlus className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                Click to upload an image
              </span>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </Label>
          </div>
        ) : (
          <div className="relative">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Button 
          onClick={handleUpload} 
          disabled={uploading || !file || !title}
          className="flex-1"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </>
          ) : (
            'Upload Image'
          )}
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onSuccess?.()}
          disabled={uploading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
