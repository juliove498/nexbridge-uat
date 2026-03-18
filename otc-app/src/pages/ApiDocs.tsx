import { useState } from 'react';
import { Card } from '../components/ui/Card';

/* ---------- tiny helpers ---------- */

const methodBase = 'font-mono text-[11px] font-bold py-0.5 px-2 rounded-[var(--radius-sm-compat)] uppercase tracking-wide shrink-0';

const methodColors: Record<string, string> = {
  GET: 'bg-[var(--info-bg)] text-[var(--info)]',
  POST: 'bg-[var(--success-bg)] text-[var(--success)]',
  PUT: 'bg-[var(--warning-bg)] text-[var(--warning)]',
  DELETE: 'bg-[var(--error-bg)] text-[var(--error)]',
};

function Method({ m }: { m: 'GET' | 'POST' | 'PUT' | 'DELETE' }) {
  return <span className={`${methodBase} ${methodColors[m]}`}>{m}</span>;
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button className="flex items-center gap-2 bg-transparent border-none text-foreground font-mono text-sm font-semibold cursor-pointer p-0 hover:text-primary" onClick={() => setOpen((o) => !o)}>
        <svg
          className={`transition-transform duration-200 text-[var(--text-tertiary)] ${open ? 'rotate-90' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        {title}
      </button>
      {open && <div style={{ marginTop: 16 }}>{children}</div>}
    </Card>
  );
}

/* ---------- page ---------- */

export function ApiDocs() {
  return (
    <div className="max-w-[860px] flex flex-col gap-6">
      <h1 className="font-mono text-2xl font-bold">API Documentation</h1>
      <p className="text-sm text-muted-foreground -mt-3 leading-relaxed">
        REST API reference for the NexBridge OTC Desk. All endpoints require
        authentication unless noted otherwise.
      </p>

      {/* -- Base URL -- */}
      <div className="flex items-center gap-2.5 py-3.5 px-[18px] bg-secondary border border-border rounded-[var(--radius-md-compat)] font-mono text-[13px] text-foreground">
        <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wide whitespace-nowrap">Base URL</span>
        https://api.nexbridge.io/v1
      </div>

      {/* -- Auth -- */}
      <div className="flex items-start gap-2.5 py-3.5 px-[18px] bg-[var(--warning-bg)] border border-[rgba(251,191,36,0.15)] rounded-[var(--radius-md-compat)] text-[13px] text-foreground leading-relaxed [&_svg]:shrink-0 [&_svg]:text-[var(--warning)] [&_svg]:mt-px">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div>
          <strong>Authentication</strong> — Include a valid Cognito ID token in
          every request:
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3" style={{ marginTop: 8 }}>
            Authorization: Bearer &lt;id_token&gt;
          </div>
        </div>
      </div>

      {/* -- Error format -- */}
      <Section title="Error Responses" defaultOpen={false}>
        <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
          All errors return a JSON body with the following shape:
        </p>
        <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3" style={{ marginTop: 12 }}>
{`{
  "error": "string",
  "message": "Human-readable description"
}`}
        </div>
        <table className="w-full border-collapse text-[13px] max-md:text-xs" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Status</th>
              <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 pr-3 border-b border-border align-top"><span className="inline-block font-mono text-[11px] py-0.5 px-1.5 rounded bg-secondary text-muted-foreground">400</span></td>
              <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Bad request / validation error</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 border-b border-border align-top"><span className="inline-block font-mono text-[11px] py-0.5 px-1.5 rounded bg-secondary text-muted-foreground">401</span></td>
              <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Missing or invalid token</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 border-b border-border align-top"><span className="inline-block font-mono text-[11px] py-0.5 px-1.5 rounded bg-secondary text-muted-foreground">403</span></td>
              <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Forbidden — insufficient permissions</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 border-b border-border align-top"><span className="inline-block font-mono text-[11px] py-0.5 px-1.5 rounded bg-secondary text-muted-foreground">404</span></td>
              <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Resource not found</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 border-b border-border align-top"><span className="inline-block font-mono text-[11px] py-0.5 px-1.5 rounded bg-secondary text-muted-foreground">429</span></td>
              <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Rate limited — retry after cooldown</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 border-b border-border align-top"><span className="inline-block font-mono text-[11px] py-0.5 px-1.5 rounded bg-secondary text-muted-foreground">500</span></td>
              <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Internal server error</td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* -- Settings -- */}
      <Section title="Settings">
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="GET" />
            <span className="font-mono text-[13px] text-foreground">/settings</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Returns platform configuration including available assets, supported
            networks, and fee schedule.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Response</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`{
  "assets": [
    {
      "id": "USTBL",
      "name": "U.S. Treasury Bills",
      "ticker": "USTBL",
      "networks": ["ethereum", "liquid"],
      "minAmount": 100,
      "maxAmount": 1000000
    }
  ],
  "fees": {
    "USTBL": 0.001
  }
}`}
          </div>
        </div>
      </Section>

      {/* -- Users -- */}
      <Section title="Users">
        {/* GET /users/me */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="GET" />
            <span className="font-mono text-[13px] text-foreground">/users/me</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Returns the authenticated user's profile.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Response</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`{
  "id": "usr_abc123",
  "email": "user@example.com",
  "givenName": "Jane",
  "familyName": "Doe",
  "kycStatus": "approved",
  "createdAt": "2025-06-15T10:30:00Z"
}`}
          </div>
          <table className="w-full border-collapse text-[13px] max-md:text-xs">
            <thead>
              <tr>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Field</th>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Type</th>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">id</span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Unique user identifier</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">email</span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Account email address</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">kycStatus</span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">enum</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">not_started</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">pending</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">approved</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">rejected</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* POST /users/:userId/createKycUrl */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="POST" />
            <span className="font-mono text-[13px] text-foreground">/users/:userId/createKycUrl</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Generates a one-time KYC verification URL. Redirect the user to the
            returned URL to begin identity verification.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Response</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`{
  "url": "https://verify.nexbridge.io/kyc?token=..."
}`}
          </div>
        </div>
      </Section>

      {/* -- Wallets / Addresses -- */}
      <Section title="Wallet Addresses">
        {/* GET /addresses */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="GET" />
            <span className="font-mono text-[13px] text-foreground">/addresses</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Lists all whitelisted wallet addresses for the authenticated user.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Response</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`[
  {
    "id": "addr_xyz789",
    "label": "My Ethereum Wallet",
    "address": "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
    "network": "ethereum",
    "createdAt": "2025-07-01T14:00:00Z"
  }
]`}
          </div>
        </div>

        {/* POST /addresses */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="POST" />
            <span className="font-mono text-[13px] text-foreground">/addresses</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Whitelist a new wallet address. The address must be valid for the
            specified network.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Request body</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`{
  "label": "My Ethereum Wallet",
  "address": "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
  "network": "ethereum"
}`}
          </div>
          <table className="w-full border-collapse text-[13px] max-md:text-xs">
            <thead>
              <tr>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Field</th>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Type</th>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">label<span className="text-[var(--error)] text-[10px] font-semibold ml-1">*</span></span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Human-readable label (max 50 chars)</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">address<span className="text-[var(--error)] text-[10px] font-semibold ml-1">*</span></span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Blockchain wallet address</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">network<span className="text-[var(--error)] text-[10px] font-semibold ml-1">*</span></span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Network identifier (e.g. "ethereum", "liquid")</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* -- Requests -- */}
      <Section title="OTC Requests">
        {/* GET /requests */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="GET" />
            <span className="font-mono text-[13px] text-foreground">/requests</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Lists all OTC requests for the authenticated user, ordered by
            creation date (newest first).
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Response</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`[
  {
    "id": "req_001",
    "asset": "USTBL",
    "side": "buy",
    "amount": 10000,
    "status": "pending",
    "walletId": "addr_xyz789",
    "createdAt": "2025-08-10T09:00:00Z",
    "updatedAt": "2025-08-10T09:00:00Z"
  }
]`}
          </div>
        </div>

        {/* GET /requests/:id */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="GET" />
            <span className="font-mono text-[13px] text-foreground">/requests/:id</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Returns a single OTC request by ID.
          </p>
        </div>

        {/* POST /requests */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="POST" />
            <span className="font-mono text-[13px] text-foreground">/requests</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Creates a new OTC trade request. The user must have KYC approved and
            at least one whitelisted wallet.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Request body</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`{
  "asset": "USTBL",
  "side": "buy",
  "amount": 10000,
  "walletId": "addr_xyz789",
  "notes": "Preferred settlement within 24h"
}`}
          </div>
          <table className="w-full border-collapse text-[13px] max-md:text-xs">
            <thead>
              <tr>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Field</th>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Type</th>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">asset<span className="text-[var(--error)] text-[10px] font-semibold ml-1">*</span></span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Asset ticker (e.g. "USTBL")</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">side<span className="text-[var(--error)] text-[10px] font-semibold ml-1">*</span></span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">enum</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">buy</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">sell</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">amount<span className="text-[var(--error)] text-[10px] font-semibold ml-1">*</span></span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">number</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Trade amount (positive, within asset min/max)</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">walletId<span className="text-[var(--error)] text-[10px] font-semibold ml-1">*</span></span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">ID of a whitelisted wallet address</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">notes<span className="text-[var(--text-tertiary)] text-[10px] italic ml-1">optional</span></span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Free-text notes for the OTC desk</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* GET /requests/:id/pdf */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="GET" />
            <span className="font-mono text-[13px] text-foreground">/requests/:id/pdf</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Downloads a PDF summary of the OTC request. Returns{' '}
            <code>application/pdf</code> content type.
          </p>
        </div>
      </Section>

      {/* -- Deposits -- */}
      <Section title="Deposits">
        {/* POST /deposits */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="POST" />
            <span className="font-mono text-[13px] text-foreground">/deposits</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Initiates a deposit flow for an OTC trade. Returns a deposit address
            and a locked exchange rate valid for the expiry window.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Request body</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`{
  "asset": "USTBL",
  "side": "buy",
  "amount": 5000,
  "walletId": "addr_xyz789",
  "notes": ""
}`}
          </div>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Response</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`{
  "id": "dep_abc123",
  "depositAddress": "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
  "amount": 5000,
  "network": "ethereum",
  "token": "USDT",
  "status": "pending_deposit",
  "rate": 1.0475,
  "outputAmount": 4773.27,
  "outputAsset": "USTBL",
  "createdAt": "2025-08-12T15:00:00Z",
  "expiresAt": "2025-08-12T15:30:00Z"
}`}
          </div>
        </div>

        {/* GET /deposits/:id */}
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="GET" />
            <span className="font-mono text-[13px] text-foreground">/deposits/:id</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Polls the current status of a deposit. Use this endpoint to track
            confirmation progress until the deposit reaches a terminal state.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Response</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`{
  "id": "dep_abc123",
  "status": "confirming",
  "depositAddress": "0x4838...",
  "amount": 5000,
  "network": "ethereum",
  "token": "USDT",
  "confirmations": 8,
  "requiredConfirmations": 12,
  "depositTxId": "0xa1b2c3d4...",
  "rate": 1.0475,
  "createdAt": "2025-08-12T15:00:00Z",
  "updatedAt": "2025-08-12T15:02:30Z"
}`}
          </div>
          <table className="w-full border-collapse text-[13px] max-md:text-xs">
            <thead>
              <tr>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Field</th>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Type</th>
                <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">status</span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">enum</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">pending_deposit</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">detected</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">confirming</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">confirmed</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">complete</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">expired</span>
                    <span className="font-mono text-[11px] py-px px-1.5 bg-secondary rounded text-muted-foreground">failed</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">confirmations</span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">number</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Current block confirmations (present when detected)</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">requiredConfirmations</span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">number</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Confirmations required to finalize (e.g. 12)</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">depositTxId</span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Inbound transaction hash (present when detected)</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">outputTxId</span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">string</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Outbound delivery tx hash (present when complete)</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">outputAmount</span></td>
                <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-[11px] text-primary">number</span></td>
                <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">Amount of asset delivered (present when complete)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* -- Market Data -- */}
      <Section title="Market Data" defaultOpen={false}>
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="GET" />
            <span className="font-mono text-[13px] text-foreground">/ticker/:asset</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Public endpoint (no auth required). Returns the latest price data
            for an asset.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Example</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`GET https://api.nexbridge.io/v1/ticker/USTBL

{
  "ticker": "USTBL",
  "bid": "1.0470",
  "ask": "1.0480",
  "mid": "1.0475",
  "volume24h": "125000",
  "updatedAt": "2025-08-12T15:05:00Z"
}`}
          </div>
        </div>

        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2.5 flex-wrap max-md:flex-col max-md:items-start max-md:gap-1.5">
            <Method m="GET" />
            <span className="font-mono text-[13px] text-foreground">/chart/:asset?range=1m</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
            Public endpoint. Returns historical candle data for charting.
            Supported ranges: <code>1d</code>, <code>1w</code>,{' '}
            <code>1m</code>, <code>3m</code>, <code>1y</code>.
          </p>
          <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5">Response</div>
          <div className="bg-secondary border border-border rounded-[var(--radius-md-compat)] py-3.5 px-[18px] font-mono text-xs leading-[1.7] text-foreground overflow-x-auto whitespace-pre max-md:text-[11px] max-md:p-3">
{`{
  "candles": [
    { "ts": 1723456800, "mid": "1.0475", "close": "1.0473" },
    { "ts": 1723460400, "mid": "1.0478", "close": "1.0480" }
  ]
}`}
          </div>
        </div>
      </Section>

      {/* -- Rate Limits -- */}
      <Section title="Rate Limits" defaultOpen={false}>
        <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
          The API enforces per-user rate limits. When exceeded, requests return{' '}
          <code>429 Too Many Requests</code> with a{' '}
          <code>Retry-After</code> header.
        </p>
        <table className="w-full border-collapse text-[13px] max-md:text-xs" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Endpoint group</th>
              <th className="text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide py-1.5 pr-3 border-b border-border">Limit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">Authenticated endpoints</span></td>
              <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">60 requests / minute</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">Deposit creation</span></td>
              <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">10 requests / minute</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 border-b border-border align-top"><span className="font-mono text-xs text-foreground whitespace-nowrap">Public market data</span></td>
              <td className="py-2 pr-3 border-b border-border align-top text-muted-foreground text-xs">120 requests / minute</td>
            </tr>
          </tbody>
        </table>
      </Section>
    </div>
  );
}
