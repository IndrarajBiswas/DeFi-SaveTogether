import { useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS } from '../contracts'

interface GroupInfo {
  id: bigint
  members: string[]
  stake: bigint
  minApprovals: number
  active: boolean
  isMember: boolean
}

/**
 * Hook to fetch all groups where the current user is a member
 * @returns Array of groups the user belongs to
 */
export function useMyGroups() {
  const { address } = useAccount()

  // Get total group count
  const { data: groupCountData, isLoading: isLoadingCount } = useReadContract({
    ...CONTRACTS.groupVault,
    functionName: 'groupCount',
  })

  const groupCount = groupCountData ? Number(groupCountData) : 0

  // Create an array of group IDs to query
  const groupIds = useMemo(() => {
    return Array.from({ length: groupCount }, (_, i) => BigInt(i))
  }, [groupCount])

  // Fetch all groups (this is a simplified approach - for production, use events or subgraph)
  const groupQueries = groupIds.map((id) => {
    return useReadContract({
      ...CONTRACTS.groupVault,
      functionName: 'getGroup',
      args: [id],
    })
  })

  // Filter groups where user is a member
  const myGroups = useMemo((): GroupInfo[] => {
    if (!address || groupQueries.length === 0) return []

    return groupQueries
      .map((query, index) => {
        if (!query.data) return null

        const group = query.data as any
        const members = group.members || group[0] || []
        const stake = group.stake || group[1] || BigInt(0)
        const minApprovals = Number(group.minApprovals || group[2] || 0)
        const active = Boolean(group.active !== undefined ? group.active : group[3])

        const isMember = members.some(
          (member: string) => member.toLowerCase() === address.toLowerCase()
        )

        if (!isMember) return null

        return {
          id: groupIds[index],
          members,
          stake,
          minApprovals,
          active,
          isMember: true,
        }
      })
      .filter((group): group is GroupInfo => group !== null)
  }, [address, groupQueries, groupIds])

  return {
    groups: myGroups,
    isLoading: isLoadingCount || groupQueries.some((q) => q.isLoading),
    groupCount,
  }
}
