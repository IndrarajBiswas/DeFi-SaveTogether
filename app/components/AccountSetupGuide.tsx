import { ReactNode } from 'react'
import Modal from './Modal'

interface AccountSetupGuideProps {
  isOpen: boolean
  onClose: () => void
}

export default function AccountSetupGuide({ isOpen, onClose }: AccountSetupGuideProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="help-dialog">
        <div className="help-dialog-header">
          <span className="help-dialog-icon">🔐</span>
          <h2 className="help-dialog-title">Account Setup Guide</h2>
        </div>
        <div className="help-dialog-content">
          <p>
            Welcome to SaveTogether! This guide will walk you through setting up your account step-by-step.
            {`Don't`} worry if {`you're`} new to crypto - {`we'll`} explain everything!
          </p>

          <h3>What is MetaMask?</h3>
          <p>
            <strong>MetaMask</strong> is a digital wallet that lets you interact with blockchain applications like SaveTogether.
            Think of it like a secure login system that also holds your digital money. {`It's`} completely free and keeps
            your information private.
          </p>

          <h3>Step 1: Install MetaMask</h3>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>
              Visit <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>metamask.io</a> on your computer or mobile device
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Click <strong>{`"Download"`}</strong> and choose your browser (Chrome, Firefox, Edge, or Brave)
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Install the browser extension ({`it's`} like adding a small app to your browser)
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              For mobile: Download the MetaMask app from the App Store (iOS) or Google Play Store (Android)
            </li>
          </ol>

          <h3>Step 2: Create Your Account</h3>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>
              Open MetaMask and click <strong>{`"Create a new wallet"`}</strong>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Create a strong password ({`you'll`} use this to unlock MetaMask)
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>CRITICAL:</strong> Write down your <strong>Secret Recovery Phrase</strong> (12 words) on paper.
              Store it somewhere safe - this is the ONLY way to recover your account if you forget your password!
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>⚠️ Never share your recovery phrase with anyone!</strong> SaveTogether staff will NEVER ask for it.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Confirm your recovery phrase by selecting the words in order
            </li>
          </ol>

          <div style={{
            background: 'var(--color-warning-light)',
            border: '2px solid var(--color-warning)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            marginBottom: '1.5rem'
          }}>
            <strong>🔒 Security Tip:</strong> Your Secret Recovery Phrase is like the master key to your account.
            Anyone with this phrase can access your funds. Keep it private and secure!
          </div>

          <h3>Step 3: Add DIDLab Trust Testnet</h3>
          <p>SaveTogether runs on the DIDLab Trust Testnet. You need to add this network to MetaMask:</p>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>
              Click the network dropdown at the top of MetaMask (it probably says {`"Ethereum Mainnet"`})
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Click <strong>{`"Add Network"`}</strong> or <strong>{`"Add a network manually"`}</strong>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Enter these details exactly:
              <div style={{
                background: 'var(--gray-100)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                marginTop: '0.5rem'
              }}>
                <div><strong>Network Name:</strong> DIDLab Trust Testnet</div>
                <div><strong>RPC URL:</strong> https://eth.didlab.org</div>
                <div><strong>Chain ID:</strong> 252501</div>
                <div><strong>Currency Symbol:</strong> ETH</div>
                <div><strong>Block Explorer:</strong> https://explorer.didlab.org</div>
              </div>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Click <strong>{`"Save"`}</strong> and then switch to the DIDLab Trust Testnet
            </li>
          </ol>

          <h3>Step 4: Get Test Tokens</h3>
          <p>You need test tokens to use SaveTogether. These are free and only work on the testnet:</p>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>
              Visit the <a href="https://faucet.didlab.org" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>
                DIDLab Faucet
              </a>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Copy your wallet address from MetaMask (click on your account name to copy it)
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Paste your address into the faucet and request test ETH
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Wait a few seconds - the tokens will appear in your MetaMask wallet
            </li>
          </ol>

          <h3>Step 5: Connect to SaveTogether</h3>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>
              Click the <strong>{`"Connect Wallet"`}</strong> button in the top right of this page
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Select <strong>MetaMask</strong> from the options
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              Approve the connection in the MetaMask popup
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              {`You're`} all set! Your wallet address will appear in the header
            </li>
          </ol>

          <h3>Understanding Account Types</h3>
          <p>SaveTogether uses attestation levels to verify users:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>Level 0 (Unverified):</strong> New accounts start here. You can browse but cannot deposit or join groups yet.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>Level 1 (Verified User):</strong> After admin verification, you can deposit savings, join groups, and request loans.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>Level 2+ (Admin/Trusted):</strong> Elevated privileges for platform administrators and highly trusted members.
            </li>
          </ul>

          <div style={{
            background: 'var(--color-info-light)',
            border: '2px solid var(--color-info)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            marginTop: '1.5rem'
          }}>
            <strong>📝 Next Steps:</strong> After connecting your wallet, visit the Admin page to request attestation
            from a platform admin. Once verified (Level 1), you can start building your savings and accessing microfinance!
          </div>

          <h3>Need Help?</h3>
          <p>
            If you encounter any issues during setup, check out the <a href="https://metamask.io/faqs/" target="_blank" rel="noopener noreferrer">MetaMask FAQ</a> or
            reach out to the SaveTogether community for support.
          </p>
        </div>
      </div>
    </Modal>
  )
}
