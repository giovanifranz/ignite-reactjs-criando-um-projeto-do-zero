import Image from 'next/image';
import styles from './header.module.scss';
import NextLink from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      <NextLink href="/">
        <a className={styles.content}>
          <Image
            src="/spacetraveling.svg"
            height="23px"
            width="40px"
            alt="logo"
          />
          <h1>
            spacetraveling<span>.</span>
          </h1>
        </a>
      </NextLink>
    </header>
  );
}
