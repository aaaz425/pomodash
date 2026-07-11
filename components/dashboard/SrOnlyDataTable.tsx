interface Row {
  label: string;
  values: Array<string | number>;
}

interface Props {
  caption: string;
  rowHeaderLabel: string;
  columns: string[];
  rows: Row[];
}

// 차트(Recharts)는 접근성 트리에 정보가 남지 않아, 동일 데이터를 스크린리더 전용 표로 병행 제공한다.
export function SrOnlyDataTable({ caption, rowHeaderLabel, columns, rows }: Props) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{rowHeaderLabel}</th>
          {columns.map((col) => (
            <th key={col} scope="col">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            {row.values.map((value, i) => (
              <td key={i}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
