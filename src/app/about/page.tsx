"use client"

import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const AboutPage: FC = () => {
  return (
    <div className="container py-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">About</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Yash Guma</CardTitle>
          <CardDescription>Developer & Musician</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Hi, I'm Yash Guma. I'm a developer and musician passionate about creating digital experiences 
            and producing music that moves people.
          </p>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Background</h2>
            <p className="text-muted-foreground">
              With a background in both technology and music, I bring a unique perspective to everything I create. 
              My latest album "Curses" represents the intersection of my technical skills and artistic vision.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Development</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Full Stack Development</li>
                  <li>React & Next.js</li>
                  <li>TypeScript</li>
                  <li>UI/UX Design</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Music</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Music Production</li>
                  <li>Sound Design</li>
                  <li>Mixing & Mastering</li>
                  <li>Performance</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AboutPage
