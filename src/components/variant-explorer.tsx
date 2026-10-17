'use client';

import { Arrow, CloseIcon } from './ui-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { getAsset, type ProductVariant } from '@/data/showroom';
import { configurationForOption, configurationLabel, initialSelection } from '@/lib/configuration';
import MediaViewer from './media-viewer';
import { designHref } from '@/lib/fireplace-design';

type Props = {
  variants: ProductVariant[];
  modelSlug: string;
  fallbackAssetIds: string[];
  initialVariantId?: string;
  initialConfigurationId?: string;
};

export default function VariantExplorer({ variants, modelSlug, fallbackAssetIds, initialVariantId, initialConfigurationId }: Props) {
  const [selection, setSelection] = useState(() => initialSelection(variants, initialVariantId, initialConfigurationId));
  const [loadedImage, setLoadedImage] = useState('');
  const [failedImage, setFailedImage] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const zoom = useRef<HTMLDialogElement>(null);
  const variant = variants.find(v => v.id === selection.variantId)!;
  const configuration = variant.configurations?.find(c => c.id === selection.configurationId);
  const selectedLabel = configurationLabel(variant, configuration);
  // Never present a generic photo as an exact match for a missing configuration image.
  const imageId = configuration ? configuration.assetId : (variant.assetIds[0] || fallbackAssetIds[0]);
  const asset = imageId ? getAsset(imageId) : undefined;
  const galleryIds = variant.assetIds.length ? variant.assetIds : fallbackAssetIds;
  const query = new URLSearchParams({ modell: modelSlug, variant: variant.id });
  if (configuration) query.set('konfiguration', configuration.id);
  const contactHref = `/kontakt?${query}`;

  function changeSelection(next: ReturnType<typeof initialSelection>) {
    setSelection(next);
    setShareStatus('');
    const url = new URL(window.location.href);
    url.searchParams.set('variant', next.variantId);
    if (next.configurationId) url.searchParams.set('konfiguration', next.configurationId);
    else url.searchParams.delete('konfiguration');
    window.history.replaceState(null, '', url);
  }

  async function copySelection() {
    const url = new URL(`/kollektion/${modelSlug}`, window.location.origin);
    url.searchParams.set('variant', variant.id);
    if (configuration) url.searchParams.set('konfiguration', configuration.id);
    try {
      await navigator.clipboard.writeText(url.href);
      setShareStatus('Länken till ditt val är kopierad.');
    } catch {
      window.history.replaceState(null, '', url);
      setShareStatus('Det gick inte att kopiera. Kopiera sidans adress i webbläsaren.');
    }
  }

  return <>
    <section className="configurator" aria-label="Välj utförande och material">
      <figure className="config-preview">
        <div className="config-picture" aria-busy={Boolean(asset && loadedImage !== asset.src && failedImage !== asset.src)}>
          {asset && failedImage !== asset.src ? <>
            {loadedImage !== asset.src && <span className="config-loading" aria-hidden="true">Bilden laddas…</span>}
            <Image key={asset.id} src={asset.src} alt={`${variant.name}${selectedLabel ? ` · ${selectedLabel}` : ' · referensbild'}`} fill priority sizes="(max-width: 760px) 88vw, 50vw" onLoad={() => setLoadedImage(asset.src)} onError={() => setFailedImage(asset.src)}/>
            <button type="button" className="config-zoom" onClick={() => { setZoomOpen(true); zoom.current?.showModal(); }} aria-label="Förstora produktbilden">Förstora <Arrow/></button>
          </> : <p className="config-no-image">{asset ? 'Bilden kunde inte laddas.' : 'Bild saknas för den här kombinationen.'} Dina val finns kvar.</p>}
        </div>
        <figcaption className="config-caption" aria-live="polite" aria-atomic="true">
          <strong>{variant.name}</strong><span>{selectedLabel || 'Referensbild för modellserien'}</span>
        </figcaption>
      </figure>

      <div className="config-options">
        <div className="field config-execution"><label htmlFor="product-execution">Utförande</label>
          {variants.length > 1 ? <select id="product-execution" value={variant.id} onChange={e => changeSelection(initialSelection(variants, e.target.value))}>
            {variants.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select> : <p id="product-execution">{variant.name}</p>}
        </div>

        {configuration ? variant.options?.map(option => {
          const material = option.key === 'pa_dekorativ-keramik';
          const selectedValue = configuration.attributes[option.key];
          // Ignore taxonomy terms without a registered combination.
          const values = option.values.filter(v => variant.configurations?.some(c => c.attributes[option.key] === v.value));
          if (!values.length) return null;
          return <fieldset className="config-option-group" key={option.key}>
            <legend>{material ? 'Keramik' : option.key === 'pa_termotec' ? 'Brännkammare · TERMOTEC' : option.name}</legend>
            <div className={`config-choices ${material ? 'config-choices-material' : ''}`}>
              {values.map(value => {
                const match = configurationForOption(variant, configuration, option.key, value.value);
                const thumbnail = match?.assetId ? getAsset(match.assetId) : undefined;
                const selected = selectedValue === value.value;
                return <button type="button" key={value.value} className="config-choice" aria-pressed={selected} disabled={!match}
                  aria-label={`${value.label}${!match ? ' – finns inte med övriga val' : ''}`}
                  onClick={() => match && changeSelection({ variantId: variant.id, configurationId: match.id })}>
                  {material && thumbnail ? <span className="config-choice-image"><Image src={thumbnail.src} alt="" fill sizes="100px"/></span> : !material && ['vit', 'svart'].includes(value.value) ? <span aria-hidden="true" className={`config-swatch config-swatch-${value.value}`}/> : null}
                  <span>{value.label}</span><span className="config-check" aria-hidden="true">{selected ? '✓' : ''}</span>
                </button>;
              })}
            </div>
          </fieldset>;
        }) : <p className="config-help">Detta är insatsens produktutförande. Omramningen utformas separat i nästa steg.</p>}

        <p className="config-help">{configuration ? 'Bilden följer ditt val av material och brännkammare. Kulörer kan upplevas olika på olika skärmar.' : 'Bilderna visar modellserien. Se produktuppgifterna för det angivna utförandet.'}</p>
        <div className="config-actions">
          <Link className="button dark" href={designHref('omramning', modelSlug, variant.id)}>Designa med denna insats <Arrow/></Link><Link className="line-link" href={contactHref}>Fråga om insatsen <Arrow/></Link>
          <button className="line-link" type="button" onClick={copySelection}>Kopiera länk till valet <Arrow/></button>
          <p className="config-share-status" role="status">{shareStatus}</p>
        </div>
      </div>
    </section>

    <div className="config-details">
      <details className="product-disclosure">
        <summary>Tekniska uppgifter <span>{variant.name}</span></summary>
        <div className="product-disclosure-body">
          {Boolean(configuration?.sku || variant.sku) && <p className="variant-sku">Artikelnummer: {configuration?.sku || variant.sku}</p>}
          <table className="specs"><caption className="sr-only">Uppgifter för {variant.name}</caption><tbody>{Object.entries(variant.specifications).map(([key, value]) => <tr key={key}><th scope="row">{key}</th><td>{value}</td></tr>)}</tbody></table>
          <p className="specs-note">Produktunderlag kontrollerat {variant.verifiedOn}. Måtten avser själva produkten. Kontrollera även modellens säkerhetsavstånd.</p>
          {!variant.sourceName && <a className="line-link" href={variant.sourceUrl} target="_blank" rel="noreferrer">Produktuppgifter hos Kratki <Arrow/></a>}
          {variant.documentLinks?.map(link => <a className="line-link document-link" href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label} <Arrow/></a>)}
          {Boolean(variant.issues?.length) && <details className="source-details"><summary>Uppgifter att komplettera</summary><ul>{variant.issues!.map(issue => <li key={issue}>{issue}</li>)}</ul></details>}
        </div>
      </details>
      <details className="product-disclosure" onToggle={e => setGalleryOpen(e.currentTarget.open)}>
        <summary>Fler bilder och måttskisser</summary>
        <div className="product-disclosure-body"><p className="config-help">Här visas hela utförandets bildgalleri. Bilderna kan visa andra material och kulörer än ditt val ovan.</p>
          {galleryOpen && <MediaViewer key={variant.id} assetIds={galleryIds} scope="execution"/>}
        </div>
      </details>
    </div>

    <dialog ref={zoom} className="config-zoom-dialog" aria-label="Förstorad produktbild" onClose={() => setZoomOpen(false)} onClick={e => { if (e.target === e.currentTarget) zoom.current?.close(); }}>
      <div className="config-zoom-content"><button type="button" className="config-zoom-close" onClick={() => zoom.current?.close()}>Stäng <CloseIcon/></button>
        {zoomOpen && asset && <div className="config-zoom-image"><Image src={asset.src} alt={`${variant.name} · ${selectedLabel || 'Referensbild'}`} fill sizes="(max-width: 1000px) 90vw, 900px"/></div>}
        <p>{variant.name} {selectedLabel && `· ${selectedLabel}`}</p>
      </div>
    </dialog>
  </>;
}
