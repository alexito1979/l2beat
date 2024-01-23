import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getCollection } from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import { getGovernancePostEntry } from '../../getGovernancePostEntry'
import { GovernancePageProps } from '../view/GovernancePage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(config: Config): Wrapped<GovernancePageProps> {
  const posts = getCollection('posts')

  return {
    props: {
      posts: posts.map(getGovernancePostEntry).slice(0, 3),
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: false,
    },
  }
}
