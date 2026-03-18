import type { Asset, ProductDetail } from './data';

interface Props {
  asset: Asset;
  detail: ProductDetail;
  priceText: string;
  onTrade: () => void;
}

export function DetailsPanel({ asset, detail, priceText, onTrade }: Props) {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[11px] font-semibold py-1 px-3 rounded-full bg-[var(--success-bg)] text-[var(--success)] border-transparent"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--success)] mr-1 animate-pulse" /> Live</span>
        <span className="text-[11px] font-semibold py-1 px-3 rounded-full bg-secondary border border-border text-muted-foreground">{detail.cnad}</span>
        {detail.tags.map(t => <span key={t} className="text-[11px] font-semibold py-1 px-3 rounded-full bg-secondary border border-border text-muted-foreground">{t}</span>)}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] text-[var(--text-tertiary)] uppercase">Last Price</div>
          <div className="font-mono text-lg font-bold text-foreground" style={{ color: 'var(--success)' }}>{priceText}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[11px] text-[var(--text-tertiary)] uppercase">Circulating Supply</div>
          <div className="font-mono text-lg font-bold text-foreground">{asset.supply}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[11px] text-[var(--text-tertiary)] uppercase">Net Asset Value</div>
          <div className="font-mono text-lg font-bold text-foreground">{asset.nav}</div>
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3 [&_h4]:font-mono [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-foreground">
          <h4>Underlying Asset</h4>
          {detail.underlying.map(item => (
            <div key={item.label} className="flex justify-between text-[12px]">
              <span className="text-[var(--text-tertiary)]">{item.label}</span>
              <span className="text-foreground font-medium">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 [&_h4]:font-mono [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-foreground">
          <h4>Trading Venues</h4>
          <div className="flex flex-wrap gap-2">
            {detail.venues.map(v => (
              <a key={v.name} href={v.url} target="_blank" rel="noopener noreferrer" className="text-[11px] py-0.5 px-2.5 rounded-full bg-secondary border border-border text-muted-foreground font-medium no-underline hover:border-primary hover:text-primary transition-all duration-200">{v.name}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 gap-2">
        {detail.links.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 px-3 bg-secondary border border-border rounded-[var(--radius-sm-compat)] text-[12px] text-muted-foreground no-underline transition-all duration-200 hover:border-primary hover:text-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            {link.label}
          </a>
        ))}
      </div>

      {/* CTA Row */}
      <div className="flex gap-3">
        <button type="button" className="flex-1 py-3 bg-gradient-to-r from-primary to-[var(--orange-light)] text-white font-semibold text-sm rounded-[var(--radius-md-compat)] border-none cursor-pointer hover:shadow-[0_0_20px_var(--orange-glow)] transition-all duration-200" onClick={onTrade}>Trade {asset.ticker} &rarr;</button>
        <a href={detail.learnUrl} target="_blank" rel="noopener noreferrer" className="py-3 px-6 bg-secondary border border-border text-muted-foreground font-semibold text-sm rounded-[var(--radius-md-compat)] no-underline transition-all duration-200 hover:bg-accent hover:text-foreground">Learn More</a>
      </div>
    </div>
  );
}
