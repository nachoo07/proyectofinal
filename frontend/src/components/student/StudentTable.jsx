import React from 'react';

const StudentTable = ({ students }) => {
  return (
    <table border="1" cellPadding="10" cellSpacing="0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Direccion</th> 
          <th>Categoria</th>
        </tr>
      </thead> 
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.name}</td>
            <td>{student.address}</td>
            <td>{student.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;