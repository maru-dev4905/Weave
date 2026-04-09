import { Card } from './Card.jsx';

export function GuideTable({ headers, rows }) {
  return (
    <Card className="guide_table_card">
      <div className="guide_table_wrap">
        <table className="guide_table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${headers[0]}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`}>
                    {typeof cell === 'string' && isCodeLikeCell(cell) ? <code>{cell}</code> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function isCodeLikeCell(cell) {
  return cell.startsWith('.') || cell.startsWith('[') || cell.startsWith('data-') || cell.startsWith('#');
}
