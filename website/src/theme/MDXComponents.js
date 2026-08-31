// Global MDX components. Registering Tabs/TabItem/Button/ResizableTable/Raw here
// means docs need no per-file imports — which also keeps the editor round-trip
// clean (no import lines for authors to mangle) and lets Keystatic open these
// pages at all, since it cannot handle raw MDX imports.
//
// Anything insertable from an editor toolbar MUST be registered here, or the
// page fails to build with an "unknown component" error.
import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
// Docusaurus's own callout component. A callout inserted from the editor as
// <Admonition type="warning"> therefore renders identically to the `:::warning`
// syntax — same component, so there is no second implementation to keep in sync.
import Admonition from '@theme/Admonition';
import Button from '@site/src/components/Button';
import ResizableTable from '@site/src/components/ResizableTable';
import Raw from '@site/src/components/Raw';
import Banner from '@site/src/components/Banner';

export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  Admonition,
  Button,
  ResizableTable,
  Raw,
  Banner,
};
