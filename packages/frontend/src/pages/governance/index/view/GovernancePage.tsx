import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Link } from '../../../../components/Link'
import { PageContent } from '../../../../components/PageContent'
import { GovernancePostEntry } from '../../getGovernancePostEntry'

export interface GovernancePageProps {
  posts: GovernancePostEntry[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePage(props: GovernancePageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        Governance page
        {props.posts.map((post) => (
          <div key={post.id}>
            <Link href={`/governance/posts/${post.id}`}>{post.title}</Link>
          </div>
        ))}
        <Link href="/governance/posts">All posts</Link>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
