'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { ProductVariant } from '@/data/showroom';
import MediaViewer from './media-viewer';

export default function VariantExplorer({variants, modelSlug}:{variants:ProductVariant[]; modelSlug:string}) {
  const [variantId, setVariantId] = useState(variants[0].id);
  const [configurationId, setConfigurationId] = useState('');
  const variant = variants.find(v => v.id === variantId)!;
  const configuration = variant.configurations?.find(c => c.id === configurationId);
  const label = (attributes: Record<string,string>) => Object.entries(attributes).map(([key,value]) => {
    const option = variant.options?.find(o => o.key === key);
    return `${option?.name || key}: ${option?.values.find(v => v.value === value)?.label || value}`;
  }).join(' · ');
  const imageIds = [...new Set([configuration?.assetId, ...variant.assetIds].filter((id):id is string => Boolean(id)))];
  return <div className="variant-explorer">
    <div className="variant-selection">
      <div className="field"><label htmlFor="product-execution">Välj utförande</label><select id="product-execution" value={variantId} onChange={e => {setVariantId(e.target.value);setConfigurationId('');}}>{variants.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
      {Boolean(variant.configurations?.length) && <div className="field"><label htmlFor="product-configuration">Material & brännkammare</label><select id="product-configuration" value={configurationId} onChange={e => setConfigurationId(e.target.value)}><option value="">Visa utförandets bildgalleri</option>{variant.configurations!.map(c => <option key={c.id} value={c.id}>{label(c.attributes)}</option>)}</select></div>}
    </div>
    <div className="variant-content" aria-live="polite">
      {imageIds.length > 0 && <MediaViewer key={`${variantId}-${configurationId}`} assetIds={imageIds} scope="execution"/>}
      <article className="variant-information">
        <p className="eyebrow">UTFÖRANDE / {variant.name}</p><h3>{variant.name}</h3>
        {configuration && <p className="configuration-label">{label(configuration.attributes)}</p>}
        {Boolean(configuration?.sku || variant.sku) && <p className="variant-sku">Artikelnummer: {configuration?.sku || variant.sku}</p>}
        <table className="specs"><caption className="sr-only">Uppgifter för {variant.name}</caption><tbody>{Object.entries(variant.specifications).map(([key,value]) => <tr key={key}><th scope="row">{key}</th><td>{value}</td></tr>)}</tbody></table>
        {variant.options?.map(option => <p className="available-options" key={option.key}><strong>{option.name}</strong><br/>{option.values.map(v => v.label).join(' · ')}</p>)}
        {Boolean(variant.issues?.length) && <details className="source-details"><summary>Uppgifter att komplettera</summary><ul>{variant.issues!.map(issue => <li key={issue}>{issue}</li>)}</ul></details>}
        <p className="specs-note">Källa: {variant.sourceName || 'Kratki'}, hämtad {variant.verifiedOn}. Mått avser produkten, inte installationsutrymmet. Garantivillkor framgår av källan.</p>
        <a className="line-link" href={variant.sourceUrl} target="_blank" rel="noreferrer">Produktuppgifter hos {variant.sourceName || 'Kratki'} ↗</a>
        {variant.documentLinks?.map(link => <a className="line-link document-link" href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
        <Link className="button dark variant-advice" href={`/kontakt?modell=${modelSlug}&variant=${variant.id}${configuration ? `&konfiguration=${configuration.id}` : ''}`}>Fråga om {variant.name} ↗</Link>
      </article>
    </div>
  </div>;
}
