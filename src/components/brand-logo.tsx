import Image from 'next/image';

export default function BrandLogo({ priority = false, sizes = '(max-width: 760px) 140px, 174px' }: { priority?: boolean; sizes?: string }) {
  return <Image className="brand-logo" src="/images/stockholm-vedspisar-logo.png" alt="Stockholm Vedspisar" width={3000} height={1380} sizes={sizes} priority={priority}/>;
}
