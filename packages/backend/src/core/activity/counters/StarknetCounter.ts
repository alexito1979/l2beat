import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity/BlockTransactionCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarknetClient } from '../../../peripherals/starknet/StarknetClient'
import { Clock } from '../../Clock'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
import { SequenceProcessor } from '../../SequenceProcessor'
import { SimpleActivityTransactionConfig } from '../ActivityTransactionConfig'
import { TransactionCounter } from '../TransactionCounter'
import { createBlockTransactionCounter } from './BlockTransactionCounter'
import { getBatchSizeFromCallsPerMinute } from './getBatchSizeFromCallsPerMinute'

export function createStarknetCounter(
  projectId: ProjectId,
  blockRepository: BlockTransactionCountRepository,
  http: HttpClient,
  sequenceProcessorRepository: SequenceProcessorRepository,
  logger: Logger,
  clock: Clock,
  options: SimpleActivityTransactionConfig<'starknet'>,
): TransactionCounter {
  const batchSize = getBatchSizeFromCallsPerMinute(options.callsPerMinute)
  const client = new StarknetClient(options.url, http, {
    callsPerMinute: options.callsPerMinute,
  })

  const processor = new SequenceProcessor(
    projectId.toString(),
    logger,
    sequenceProcessorRepository,
    {
      batchSize,
      startFrom: 0,
      getLatest: async (previousLatest) => {
        const blockNumber = await client.getBlockNumberAtOrBefore(
          clock.getLastHour(),
          previousLatest,
        )
        return blockNumber
      },
      processRange: async (from, to, trx, logger) => {
        const queries = range(from, to + 1).map((blockNumber) => async () => {
          const block = await client.getBlock(blockNumber)

          return {
            projectId,
            blockNumber: block.number,
            count: block.transactions.length,
            timestamp: new UnixTime(block.timestamp),
          }
        })

        const blocks = await promiseAllPlus(queries, logger, {
          metricsId: 'StarkNetBlockCounter',
        })
        await blockRepository.addOrUpdateMany(blocks, trx)
      },
    },
  )

  return createBlockTransactionCounter(projectId, processor, blockRepository)
}
