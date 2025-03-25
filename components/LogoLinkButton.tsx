import Link from 'next/link';
import Image from 'next/image';
import roamrLogo from '@/public/roamr-logo.webp';

export default function LogoLinkButton({
  className,
  width,
}: {
  className?: string;
  width: number;
}) {
  return (
    <Link href="/" className={className}>
      <Image src={roamrLogo} alt="Roamr Logo" width={width} />
    </Link>
  );
}
