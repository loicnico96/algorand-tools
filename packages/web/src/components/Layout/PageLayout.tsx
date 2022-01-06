import styled from "@emotion/styled"
import { useNetworkContext } from "context/NetworkContext"
import { ReactNode } from "react"
import { ConnectionInfo } from "./ConnectionInfo"
import { PageContainer } from "./PageContainer"
import { PageContent } from "./PageContent"
import { PageHead } from "./PageHead"
import { PageHeader } from "./PageHeader"

export interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  const { network } = useNetworkContext()

  return (
    <PageContainer>
      <PageHeader>
        <PageHead title="Algorand Tools" />
        <PageHeaderTitle>Algorand Tools ({network})</PageHeaderTitle>
        <ConnectionInfo />
      </PageHeader>
      <PageContent>{children}</PageContent>
    </PageContainer>
  )
}

const PageHeaderTitle = styled.div`
  flex: 1 1 auto;
`
