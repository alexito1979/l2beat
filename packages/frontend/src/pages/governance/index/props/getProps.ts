import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getContent } from '../../../../content/getContent'
import { Wrapped } from '../../../Page'
import { getGovernancePublicationEntry } from '../../getGovernancePublicationEntry'
import { GovernancePageProps } from '../view/GovernancePage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(config: Config): Wrapped<GovernancePageProps> {
  const publications = getContent('publications')

  return {
    props: {
      publications: publications
        .sort((a, b) => {
          return b.data.publishedOn.getTime() - a.data.publishedOn.getTime()
        })
        .map(getGovernancePublicationEntry),
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: false,
    },
  }
}
