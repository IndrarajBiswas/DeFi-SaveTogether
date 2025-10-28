import { FormEvent, useState } from 'react'

export default function AdminPage() {
  const [address, setAddress] = useState('0x')
  const [level, setLevel] = useState(1)
  const [paramKey, setParamKey] = useState('groupMaxExposure')
  const [paramValue, setParamValue] = useState('2000000000')

  const handleAttest = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    window.alert(`Mock attest ${address} at level ${level}`)
  }

  const handleParamUpdate = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    window.alert(`Mock governance update ${paramKey} -> ${paramValue}`)
  }

  return (
    <div className="grid">
      <section className="card">
        <h1>Admin Console</h1>
        <p>
          Governance lite controls issuer allowlist, economic parameters, and pause state. Use a multisig
          wallet in production.
        </p>
      </section>

      <section className="card">
        <h2>Attest Pilot User</h2>
        <form className="form" onSubmit={handleAttest}>
          <label>
            Address
            <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x..." />
          </label>
          <label>
            Level
            <select value={level} onChange={(event) => setLevel(Number(event.target.value))}>
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </label>
          <button type="submit">Simulate attest()</button>
        </form>
      </section>

      <section className="card">
        <h2>Update Parameter</h2>
        <form className="form" onSubmit={handleParamUpdate}>
          <label>
            Parameter
            <select value={paramKey} onChange={(event) => setParamKey(event.target.value)}>
              <option value="groupMaxExposure">groupMaxExposure</option>
              <option value="minPrincipal">minPrincipal</option>
              <option value="maxPrincipal">maxPrincipal</option>
              <option value="rateBpsPer4Weeks">rateBpsPer4Weeks</option>
            </select>
          </label>
          <label>
            New value
            <input value={paramValue} onChange={(event) => setParamValue(event.target.value)} />
          </label>
          <button type="submit">Simulate governance call</button>
        </form>
        <div className="notice">
          Always record governance changes in docs/params.md and share with subgraph/data teams.
        </div>
      </section>

      <section className="card">
        <h2>Emergency Pausing</h2>
        <p>
          Use `GovernanceLite.pause()` to halt state-changing credit operations. `unpause()` restores normal
          activity once the incident is resolved. Refer to `docs/runbook.md` for full procedure.
        </p>
      </section>
    </div>
  )
}
