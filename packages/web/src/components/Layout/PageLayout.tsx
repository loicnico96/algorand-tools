import { ReactNode } from "react"
import { PageContainer } from "./PageContainer"
import { PageContent } from "./PageContent"
import { PageHead } from "./PageHead"
import { PageHeader } from "./PageHeader"

export interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <PageContainer>
      <PageHeader>
        Algorand Tools
        <PageHead title="Algorand Tools" />
      </PageHeader>
      <PageContent>{children}</PageContent>
    </PageContainer>
  )
}
