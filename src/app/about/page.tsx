"use client"

import { type FC } from 'react'

const AboutPage: FC = () => {
  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-4xl font-bold">About Me</h1>
      <p className="text-lg text-muted-foreground">
        Hi, I'm Yash Guma. I'm a developer and musician based in [Your Location].
      </p>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Background</h2>
        <p className="text-muted-foreground">
          [Your background information here]
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>Web Development</li>
          <li>Music Production</li>
          <li>[Other skills]</li>
        </ul>
      </div>
    </div>
  )
}

export default AboutPage
