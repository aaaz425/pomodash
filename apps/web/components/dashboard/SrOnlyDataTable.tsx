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

// Recharts는 접근성 트리에 정보가 안 남아 동일 데이터를 스크린리더용 표로 병행 제공 — table에 직접 sr-only를 주면 레이아웃 축소가 무시돼 감싸는 div에 적용
export function SrOnlyDataTable({ caption, rowHeaderLabel, columns, rows }: Props) {
  return (
    <div className="sr-only">
      <table>
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
    </div>
  );
}
