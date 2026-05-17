import Image from 'next/image';
import Link from 'next/link';

const OwnerHomeLink = () => {
  return (
    <Link href="/" className="owner-home-logo" aria-label="Back to home">
      <Image
        src="/Logo.PNG"
        alt="Steve Zhu signature"
        width={209}
        height={65}
        priority
        className="theme-logo h-10 w-auto object-contain"
      />
    </Link>
  );
};

export default OwnerHomeLink;
