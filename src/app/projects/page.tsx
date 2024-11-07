"use client"

import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const ProjectsPage: FC = () => {
  const projects = [
    {
      title: "Project 1",
      description: "Description of project 1",
      link: "https://github.com/yourusername/project1"
    },
    {
      title: "Project 2",
      description: "Description of project 2",
      link: "https://github.com/yourusername/project2"
    },
    // Add more projects as needed
  ]

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-4xl font-bold">Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage
