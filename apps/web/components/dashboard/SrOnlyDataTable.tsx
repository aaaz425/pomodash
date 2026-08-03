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
// table 태그에 직접 sr-only를 주면 테이블 자체 레이아웃 알고리즘이 width/height 축소를 무시해
// 행이 많을 때 실제 레이아웃 공간을 차지할 수 있다 — 감싸는 div에 sr-only를 적용해 우회한다.
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
