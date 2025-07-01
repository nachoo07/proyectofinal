import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";  // Importar useNavigate
import { StudentContext } from "../../context/student/StudentContext";

const StudentTable = () => {
  const { students, deleteStudent } = useContext(StudentContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();  // Hook para navegar programáticamente

  if (!students) {
    return <p>Cargando estudiantes...</p>;
  }

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.address} ${student.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Panel de Alumnos</h1>

      {/* Botón Volver */}
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)}
        type="button"
      >
        Volver
      </button>

      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Buscar por nombre, dirección o categoría"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "5px", width: "100%", maxWidth: "300px" }}
        />
      </div>

      <Link to="/students/new">
        <button>Nuevo Alumno</button>
      </Link>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.address}</td>
              <td>{student.category}</td>
              <td>
                <Link to={`/students/${student.id}`}>
                  <button>Ver</button>
                </Link>
                <Link to={`/students/${student.id}?edit=true`}>
                  <button>Editar</button>
                </Link>
                <Link to={`/students/${student.id}/shares`}>
                  <button>Ver Cuotas</button>
                </Link>

                &nbsp;
                <button onClick={() => deleteStudent(student.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {filteredStudents.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No se encontraron estudiantes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
