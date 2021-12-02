import Image from 'next/image';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Image src="/spacetraveling.svg" height="23px" width="40px" />
        <h1>
          spacetraveling<span>.</span>
        </h1>
      </div>
    </header>
  );
}
