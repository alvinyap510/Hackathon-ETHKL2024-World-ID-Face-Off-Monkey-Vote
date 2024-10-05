'use client'
import { Container } from "@chakra-ui/react"
import type { ReactNode } from "react"
import Nav from "@/components/Navbar/Navbar"



export type Root = {
    children: ReactNode
  }
export const RootLayout = ({
  children,
}: Root) => {


  return (
    <Container mx="auto" maxW='1080px'>
      <Nav/>
      {children}
    </Container>
  )
}