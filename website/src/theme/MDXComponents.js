// Global MDX components. Registering Tabs/TabItem/Button/ResizableTable here
// means docs need no per-file imports — which also keeps Decap's markdown
// round-trip cleaner (no import lines for authors to mangle).
import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/Button';
import ResizableTable from '@site/src/components/ResizableTable';

export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  Button,
  ResizableTable,
};
