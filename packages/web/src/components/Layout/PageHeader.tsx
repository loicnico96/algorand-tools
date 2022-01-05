import styled from "@emotion/styled"
import { ReactNode } from "react"

export interface PageHeaderProps {
  children: ReactNode
}

export const PageHeader = styled.div<PageHeaderProps>`
  align-items: center;
  background-color: #ccc;
  column-gap: 8px;
  display: flex;
  height: 64px;
  padding: 16px 48px;
`
