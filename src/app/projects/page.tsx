"use client"

import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

const ProjectsPage: FC = () => {
  const projects = [
    {
      title: "Curses Album",
      description: "Latest musical project featuring electronic and experimental sounds",
      link: "https://open.spotify.com/artist/yourid",
      github: null,
      tags: ["Music", "Production", "Electronic"]
    },
    {
      title: "Image Carousel App",
      description: "A Next.js application for sharing and interacting with images",
      link: "https://your-site.com",
      github: "https://github.com/yourusername/project",
      tags: ["Next.js", "TypeScript", "Supabase"]
    },
    {
      title: "Project Three",
      description: "Another awesome project description",
      link: "https://project-three.com",
      github: "https://github.com/yourusername/project-three",
      tags: ["React", "Node.js", "MongoDB"]
    }
  ]

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 mt-auto">
              <Button variant="outline" size="sm" asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit
                </a>
              </Button>
              {project.github && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage
