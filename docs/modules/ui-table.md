# UI Component: Table

## Purpose and Scope

The `Table` component and its associated sub-components are used to display tabular data in a structured and styled manner. These components provide semantic HTML elements (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`, `<caption>`, `<tfoot>`) with Tailwind CSS classes for styling. The main `Table` component is wrapped in a `div` to allow for horizontal scrolling on smaller viewports.

## Main Exported Components

*   **`Table`**: The main wrapper component. It renders a `div` container that allows for horizontal scrolling (`overflow-x-auto`) and a `<table>` element inside it.
    *   Props: Standard `table` props, plus `className` for the `<table>` element.
    *   Styling: The inner `<table>` has `w-full caption-bottom text-sm`.
*   **`TableHeader`**: Renders a `<thead>` element.
    *   Props: Standard `thead` props, plus `className`.
    *   Styling: `[&_tr]:border-b` applies a bottom border to `<tr>` elements within the header.
*   **`TableBody`**: Renders a `<tbody>` element.
    *   Props: Standard `tbody` props, plus `className`.
    *   Styling: `[&_tr:last-child]:border-0` removes the bottom border from the last `<tr>` element in the body.
*   **`TableFooter`**: Renders a `tfoot` element.
    *   Props: Standard `tfoot` props, plus `className`.
    *   Styling: `bg-muted/50 border-t font-medium [&>tr]:last:border-b-0` provides a background, top border, font weight, and removes the bottom border from its last row.
*   **`TableRow`**: Renders a `<tr>` (table row) element.
    *   Props: Standard `tr` props, plus `className`.
    *   Styling: `hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors` provides hover effects, selected state styling, a bottom border, and color transition.
*   **`TableHead`**: Renders a `<th>` (table header cell) element.
    *   Props: Standard `th` props, plus `className`.
    *   Styling: `text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap` defines text color, height, padding, alignment, font weight, and prevents text wrapping.
        *   `[&:has([role=checkbox])]:pr-0`: Removes right padding if the cell contains an element with `role="checkbox"`.
        *   `[&>[role=checkbox]]:translate-y-[2px]`: Adjusts the vertical position of a direct child element with `role="checkbox"`.
*   **`TableCell`**: Renders a `<td>` (table data cell) element.
    *   Props: Standard `td` props, plus `className`.
    *   Styling: `p-2 align-middle whitespace-nowrap` defines padding, alignment, and prevents text wrapping.
        *   `[&:has([role=checkbox])]:pr-0`: Removes right padding if the cell contains an element with `role="checkbox"`.
        *   `[&>[role=checkbox]]:translate-y-[2px]`: Adjusts the vertical position of a direct child element with `role="checkbox"`.
*   **`TableCaption`**: Renders a `<caption>` element for the table.
    *   Props: Standard `caption` props, plus `className`.
    *   Styling: `text-muted-foreground mt-4 text-sm` styles the caption text and adds top margin.

## Usage Examples

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming '@' is an alias for 'src'

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
];

function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default TableDemo;
```

## Styling

*   Uses the `cn` utility from ` "@/lib/utils"` for merging and conditional class names.
*   Relies on Tailwind CSS for all styling.
*   The `Table` component itself is wrapped in a `div` with `overflow-x-auto` to ensure responsiveness by allowing horizontal scrolling if the table content is too wide.
*   Specific styling is applied for hover states (`hover:bg-muted/50`) and selected states (`data-[state=selected]:bg-muted`) on `TableRow`.
*   Cells (`TableHead`, `TableCell`) have styles to handle cases where they contain checkboxes, adjusting padding and checkbox alignment.
*   `data-slot` attributes are present on all sub-components for potential global styling or testing.

## Relationships with Other Modules

*   **`@/lib/utils` (`cn` function)**: Used for class name construction.
*   **Tailwind CSS**: Provides all utility classes for styling.
*   **Global Styles (`theme.css`, `globals.css`)**: May be influenced by global CSS variables (e.g., `text-muted-foreground`, `bg-muted`, `text-foreground`).

These `Table` components provide a comprehensive set of tools for creating structured, accessible, and well-styled data tables within the IziFlow plugin UI.
