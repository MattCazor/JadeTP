/* import { gql, useQuery } from '@apollo/client'
CopyCopyimport { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const GetRecentMessagesQuery = gql`
  query GetRecentMessages($last: Int) {
    messageCollection(last: $last) {
      edges {
        node {
          id
          username
          avatar
          body
          likes
          createdAt
        }
      }
    }
  }
`

export const MessageList = () => {
    const [scrollRef, inView, entry] = useInView({
      trackVisibility: true,
      delay: 500,
    })

export const MessageList = () => {
  const { loading, error, data } = useQuery<{
    messageCollection: { edges: { node: IMessage }[] }
  }>(GetRecentMessagesQuery, {
    variables: {
      last: 100,
    },
  })

  useEffect(() => {
    if (inView) {
      entry?.target?.scrollIntoView({ behavior: 'auto' })
    }
  }, [data, entry, inView])

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-white">Fetching most recent chat messages.</p>
      </div>
    )

  if (error)
    return (
      <p className="text-white">Something went wrong. Refresh to try again.</p>
    )

  return (
    <div className="flex flex-col space-y-3 overflow-y-scroll w-full">
      {data?.messageCollection?.edges?.map(({ node }) => (
        <Message key={node?.id} message={node} />
      ))}
    </div>
  )
}
} */