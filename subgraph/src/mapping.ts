import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { GroupCreated, GroupStakeLocked } from '../../out/GroupVault.sol/GroupVault'
import { LoanOpened, Repaid, Rescheduled, Defaulted } from '../../out/CreditLine.sol/CreditLine'
import { Deposited } from '../../out/SavingsPool.sol/SavingsPool'
import { Group, Loan, LoanEvent, SavingsStat } from '../generated/schema'

export function handleGroupCreated(event: GroupCreated): void {
  const id = event.params.gid.toString()
  let g = new Group(id)
  let members = event.params.members
  let arr = new Array<Bytes>()
  for (let i = 0; i < members.length; i++) arr.push(Bytes.fromHexString(members[i].toHexString()) as Bytes)
  g.members = arr
  g.minApprovals = event.params.minApprovals
  g.stake = BigInt.zero()
  g.active = true
  g.save()
}

export function handleGroupStakeLocked(event: GroupStakeLocked): void {
  const id = event.params.gid.toString()
  let g = Group.load(id)
  if (g == null) return
  g.stake = g.stake.plus(event.params.amount)
  g.save()
}

export function handleLoanOpened(event: LoanOpened): void {
  const id = event.params.loanId.toString()
  let l = new Loan(id)
  l.borrower = event.params.borrower
  l.principal = event.params.principal
  l.rateBps = event.params.rateBps as i32
  l.termWeeks = event.params.termWeeks as i32
  l.start = event.block.timestamp.toI32()
  l.repaid = BigInt.zero()
  l.defaulted = false
  l.group = event.params.gid.toString()
  l.save()

  let e = new LoanEvent(id + '-opened')
  e.loan = id
  e.kind = 'Opened'
  e.at = event.block.timestamp.toI32()
  e.save()
}

export function handleRepaid(event: Repaid): void {
  const id = event.params.loanId.toString()
  let l = Loan.load(id)
  if (l == null) return
  l.repaid = event.params.newRepaid
  l.save()

  let e = new LoanEvent(id + '-repaid-' + event.transaction.hash.toHexString())
  e.loan = id
  e.kind = 'Repaid'
  e.amount = event.params.amount
  e.at = event.block.timestamp.toI32()
  e.save()
}

export function handleRescheduled(event: Rescheduled): void {
  const id = event.params.loanId.toString()
  let l = Loan.load(id)
  if (l == null) return
  l.termWeeks = l.termWeeks + (event.params.extraWeeks as i32)
  l.save()

  let e = new LoanEvent(id + '-rescheduled-' + event.transaction.hash.toHexString())
  e.loan = id
  e.kind = 'Rescheduled'
  e.amount = event.params.fee
  e.at = event.block.timestamp.toI32()
  e.save()
}

export function handleDefaulted(event: Defaulted): void {
  const id = event.params.loanId.toString()
  let l = Loan.load(id)
  if (l == null) return
  l.defaulted = true
  l.save()

  let e = new LoanEvent(id + '-defaulted')
  e.loan = id
  e.kind = 'Defaulted'
  e.amount = event.params.outstanding
  e.at = event.block.timestamp.toI32()
  e.save()
}

export function handleDeposited(event: Deposited): void {
  let id = event.params.user.toHexString()
  let s = SavingsStat.load(id)
  if (s == null) {
    s = new SavingsStat(id)
    s.consecutiveWeeks = 0
    s.lastWeek = 0
  }
  let w = event.params.weekIdx.toI32()
  if (s.lastWeek == 0 || s.lastWeek == w) {
    // no change
  } else if (w == s.lastWeek + 1) {
    s.consecutiveWeeks = s.consecutiveWeeks + 1
  } else {
    s.consecutiveWeeks = 1
  }
  if (s.lastWeek == 0) s.consecutiveWeeks = 1
  s.lastWeek = w
  s.save()
}

