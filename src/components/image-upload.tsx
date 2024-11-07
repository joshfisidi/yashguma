"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Progress } from "@/components/ui/progress"

interface ImageUploadProps {
  onSuccess?: () => void
}

export function ImageUpload({ onSuccess }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Create preview URL when file is selected
  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Cleanup
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (e.g., 5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setFile(selectedFile)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
  }

  const handleUpload = async () => {
    if (!file || !title) return

    try {
      setUploading(true)
      setUploadProgress(0)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Create upload options with proper progress tracking
      const options = {
        cacheControl: '3600',
        upsert: false,
        onProgress: (progress: { transferred: number; total: number }) => {
          if (progress.total) {
            const percent = (progress.transferred / progress.total) * 100
            setUploadProgress(Math.min(percent, 99)) // Keep at 99% until fully complete
          }
        }
      }

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('carousel-images')
        .upload(fileName, file, options)

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`)
      }

      setUploadProgress(100) // Set to 100% after successful upload

      // Get public URL
      const { data } = await supabase.storage
        .from('carousel-images')
        .getPublicUrl(fileName)

      if (!data?.publicUrl) {
        throw new Error('Failed to get public URL')
      }

      // Insert into database
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

      // Reset form
      setTitle('')
      setFile(null)
      setPreview(null)
      
      // Call onSuccess before alert
      onSuccess?.()

      // Show success message
      alert('Image uploaded successfully!')

    } catch (error) {
      console.error('Error uploading file:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
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
      
      <Button 
        onClick={handleUpload} 
        disabled={uploading || !file || !title}
        className="w-full sticky top-4 z-20"
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
            {!uploading && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
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
    </div>
  )
}
