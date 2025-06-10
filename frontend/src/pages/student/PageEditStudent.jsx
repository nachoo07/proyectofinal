import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudentContext } from '../../context/student/StudentContext';

const PageEditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, updateStudent } = useContext(StudentContext);
  const student = students.find((s) => s.id === parseInt(id));

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    dni: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        lastname: student.lastname,
        dni: student.dni
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/api/student/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Error al actualizar el estudiante');

      const updatedStudent = await res.json();
      updateStudent(id, updatedStudent);
      alert('Estudiante actualizado con éxito');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Hubo un error al actualizar el estudiante');
    }
  };

  if (!student) return <p>Cargando estudiante...</p>;

  return (
    <div>
      <h2>Editar Estudiante</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Apellido:
          <input type="text" name="lastname" value={formData.lastName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          DNI:
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default PageEditStudent;
