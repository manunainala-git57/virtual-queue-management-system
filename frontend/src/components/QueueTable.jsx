import "../styles/table.css";

const QueueTable = ({ queue, onServe }) => {
  return (
    <div className="table-container">
      <h3>Customer Queue</h3>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Customer</th>
            <th>Customers Ahead</th>
            <th>Estimated Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((q, index) => (
            <tr key={q.id}>
              <td>#{q.token_number}</td>
              <td>{q.user_name}</td>
              <td>{index}</td>
              <td>{q.estimated_time}</td>
              <td>
                <span className="status">Next</span>
              </td>
              <td>
                <button onClick={() => onServe(q.id)}>Serve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueueTable;
