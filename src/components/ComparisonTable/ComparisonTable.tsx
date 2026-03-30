import './ComparisonTable.scss';

type Props = {
  headers: string[];
  rows: string[][];
  caption?: string;
};

export const ComparisonTable = ({ headers, rows, caption }: Props) => (
  <div className="comp-table-wrap">
    <table className="comp-table">
      {caption && <caption className="comp-table__caption">{caption}</caption>}
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} scope="col">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
