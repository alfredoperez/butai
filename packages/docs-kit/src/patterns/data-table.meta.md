---
id: data-table
name: Data Table
kind: page
category: data
description: A full-width comparison table — hairline rows, uppercase-mono headers, and two tinted compared columns (one muted, one in a status color).
tags: [page, data, table, comparison]
engine: none
source: { file: src/patterns/data-table.html }
---

```html
<!-- data-table — td.a is muted, td.b takes a status color; a theme repaints them -->
<table>
  <tr><th>Capability</th><th>Baseline</th><th>This approach</th></tr>
  <tr><td><b>Build step</b></td><td class="a">required</td><td class="b">none</td></tr>
</table>
```
