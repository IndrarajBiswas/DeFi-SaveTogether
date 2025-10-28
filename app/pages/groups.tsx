import { FormEvent, useState } from 'react'

const memberTemplate = ['0x', '0x', '0x', '0x', '0x']

export default function GroupsPage() {
  const [members, setMembers] = useState(memberTemplate)
  const [minApprovals, setMinApprovals] = useState(3)

  const handleChangeMember = (index: number, value: string) => {
    setMembers((current) => current.map((m, idx) => (idx === index ? value : m)))
  }

  const handleCreateGroup = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    window.alert(`Mock createGroup: members=${members.filter(Boolean).length}, minApprovals=${minApprovals}`)
  }

  return (
    <div className="grid">
      <section className="card">
        <h1>Group Formation</h1>
        <p>
          Groups contain 5–8 members with majority approvals (default 3-of-5). Stake is locked at 5% of the
          max group exposure. Use the form below to structure the group before submitting on-chain.
        </p>
      </section>

      <section className="card">
        <h2>Create Group Draft</h2>
        <form className="form" onSubmit={handleCreateGroup}>
          {members.map((member, index) => (
            <label key={index}>
              Member {index + 1}
              <input
                placeholder="0xabc..."
                value={member}
                onChange={(event) => handleChangeMember(index, event.target.value)}
              />
            </label>
          ))}
          <label>
            Min approvals
            <input
              type="number"
              min={3}
              max={members.filter(Boolean).length || 8}
              value={minApprovals}
              onChange={(event) => setMinApprovals(Number(event.target.value))}
            />
          </label>
          <button type="submit">Simulate createGroup()</button>
        </form>
      </section>

      <section className="card">
        <h2>Stake & Approvals</h2>
        <p>
          After group creation, each member must lock their portion of the stake using
          <code>GroupVault.lockStake</code>. Approvals are recorded per loan request via
          <code>GroupVault.approveLoan</code>.
        </p>
        <ul className="list">
          <li>Stake amount = group exposure cap × 5%.</li>
          <li>Each loan request should use the borrower address hash as approval key (pseudo loanId).</li>
          <li>Exceeding grace period without repayment allows any keeper to call `markDefault`.</li>
        </ul>
      </section>
    </div>
  )
}
