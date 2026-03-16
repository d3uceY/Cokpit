import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Full pip Control — No Terminal Required',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Install, upgrade, and uninstall packages from a clean table view. Filter
        by name, bulk-select for mass removal, and watch live pip output stream
        right inside the app — all with a click.
      </>
    ),
  },
  {
    title: 'Instant PyPI Search & Health Checks',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Query the entire PyPI index in real time and install any result
        directly. Run the built-in <strong>Doctor</strong> to verify Python,
        pip, and PyPI connectivity, and get plain-English fix hints when
        something is wrong.
      </>
    ),
  },
  {
    title: 'History, Logs & Cleanup — Built In',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Every action is logged with a timestamp and exit status so you always
        know what changed and when. Reclaim disk space by clearing pip caches,{' '}
        <code>.egg-info</code> dirs, and <code>__pycache__</code> folders in
        one click.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
