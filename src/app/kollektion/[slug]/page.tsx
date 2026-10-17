import Link from 'next/link';
import { notFound } from 'next/navigation';
import VariantExplorer from '@/components/variant-explorer';
import { Heading, ModelCard } from '@/components/showroom';
import { insertModels as models, insertVariants as variants } from '@/data/insert-catalog';

export function generateStaticParams() { return models.map(m => ({ slug: m.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = models.find(m => m.slug === slug);
  return { title: model ? `${model.name} — Kratki Pro` : 'Modellen finns inte', description: model?.description,
    openGraph: { title: model ? `${model.name} — Kratki Pro | Stockholm Vedspisar` : 'Modellen finns inte', description: model?.tagline } };
}

export default async function Page({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string; konfiguration?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const model = models.find(m => m.slug === slug);
  if (!model) notFound();
  const selectedVariants = model.variantIds.map(id => variants.find(v => v.id === id)!);

  return <>
    <nav className="breadcrumb shell" aria-label="Brödsmulor"><Link href="/">Hem</Link><span>/</span><Link href="/kollektion">Kollektion</Link><span>/</span><span>{model.name}</span></nav>
    <div className="product-page shell">
      <header className="product-heading"><p className="eyebrow">KRATKI PRO / {'KARI-SERIEN'}</p><h1>{model.name}</h1><p>{model.tagline}</p></header>
      <VariantExplorer key={model.id} variants={selectedVariants} modelSlug={model.slug} fallbackAssetIds={[...model.assetIds].sort((a,b)=>Number(b.endsWith('product'))-Number(a.endsWith('product')))}
        initialVariantId={query.variant} initialConfigurationId={query.konfiguration}/>
      <details className="product-disclosure product-story" open>
        <summary>Om {model.name}</summary>
        <div className="product-disclosure-body"><p>{model.description}</p><ul className="model-notes">{model.designNotes.map(note => <li key={note}>{note}</li>)}</ul></div>
      </details>
    </div>
    {models.length > 1 && <section className="showroom-section shell"><Heading label="KOLLEKTIONEN" title="Fler modeller."/><div className="model-grid">{models.filter(m => m.id !== model.id).slice(0, 3).map(m => <ModelCard key={m.id} model={m}/>)}</div></section>}
  </>;
}
