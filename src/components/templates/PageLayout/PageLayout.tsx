import type { ReactNode } from 'react'
import { PageHeader } from '@molecules/PageHeader'
import './PageLayout.css'

interface PageLayoutProps {
  title:     string
  subtitle?: string
  actions?:  ReactNode
  children:  ReactNode
}

export function PageLayout({ title, subtitle, actions, children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <div className="page-layout__header">
        <PageHeader title={title} subtitle={subtitle} actions={actions} />
      </div>
      <div className="page-layout__body">
        {children}
      </div>
    </div>
  )
}
