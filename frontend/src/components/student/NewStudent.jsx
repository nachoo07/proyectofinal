import React, { useState, useEffect, useContext } from "react";
import { StudentContext } from "../../context/student/StudentContext";
import { useNavigate, useParams } from "react-router-dom";

const NewStudent = () => {
  const { id } = useParams(); // si viene id es edición, si no es nuevo
  const navigate = useNavigate();
  const { students, createStudent, updateStudent } = useContext(StudentContext);

  // Estado del formulario
  const [student, setStudent] = useState({
    lastname: "",
    name: "",
    dni: "",
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (id) {
      const studentToEdit = students.find((s) => s.id.toString() === id);
      if (studentToEdit) {
        setStudent({
          lastname: studentToEdit.lastname,
          name: studentToEdit.name,
          dni: studentToEdit.dni,
        });
      }
    }
  }, [id, students]);

  // Manejar cambios del formulario
  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Edición
        await updateStudent(id, student);
      } else {
        // Crear nuevo
        await createStudent(student);
      }
      navigate("/students"); // Volver a inicio después de guardar
    } catch (error) {
      alert("Error al guardar estudiante: " + error.message);
    }
  };
 
  return (
    <div>
      <h2>{id ? "Editar Estudiante" : "Nuevo Estudiante"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="lastname"
            value={student.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>DNI:</label>
          <input
            type="text"
            name="dni"
            value={student.dni}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{id ? "Actualizar" : "Crear"}</button>
      </form>
    </div>
  );
};

export default NewStudent;
