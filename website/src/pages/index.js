import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

export default function Home() {
  return (
    <Layout
      title="Simpaisa API Documentation"
      description="Pay-in, pay-out, and remittance APIs for Pakistan, Bangladesh, Nepal, Egypt & Iraq">
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '6rem 1rem',
        }}>
        <Heading as="h1">Simpaisa API Documentation</Heading>
        <p style={{maxWidth: 560, fontSize: '1.1rem'}}>
          Integration guides and endpoint reference for Pay-In, Pay-Out, and
          Remittance APIs across Pakistan, Bangladesh, Nepal, Egypt, and Iraq.
        </p>
        <Link className="button button--primary button--lg" to="/docs/getting-started/overview">
          Get Started
        </Link>
      </main>
    </Layout>
  );
}
