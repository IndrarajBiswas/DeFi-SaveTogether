import { useMemo } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import type { Abi } from 'viem'
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
    if (groupCount === 0) return []
    return Array.from({ length: groupCount }, (_, i) => BigInt(i))
  }, [groupCount])

  const groupContracts = useMemo(() => {
    return groupIds.map((id) => ({
      address: CONTRACTS.groupVault.address,
      abi: CONTRACTS.groupVault.abi as unknown as Abi,
      functionName: 'getGroup' as const,
      args: [id] as const,
    }))
  }, [groupIds])

  const { data: groupResults, isLoading: isLoadingGroups } = useReadContracts({
    contracts: groupContracts,
    query: {
      enabled: groupContracts.length > 0,
    },
  })

  // Filter groups where user is a member
  const myGroups = useMemo((): GroupInfo[] => {
    if (!address || !groupResults?.length) return []

    return groupResults
      .map((result, index) => {
        if (!result?.result) return null

        const group = result.result as any
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
  }, [address, groupResults, groupIds])

  return {
    groups: myGroups,
    isLoading: isLoadingCount || isLoadingGroups,
    groupCount,
  }
}
