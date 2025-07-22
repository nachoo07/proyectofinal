import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import Swal from 'sweetalert2';
import { LoginContext } from '../../context/login/LoginContext';
import { StudentContext } from '../../context/student/StudentContext';
import './attendance.css';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isAttendanceSaved, setIsAttendanceSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalAttendance, setOriginalAttendance] = useState({});
  const { auth } = useContext(LoginContext);
  const { students } = useContext(StudentContext);
  const navigate = useNavigate();

  const categories = ['Sin categoría', ...Array.from({ length: 2020 - 2010 + 1 }, (_, i) => String(2010 + i))];

  useEffect(() => {
    if (selectedCategory && selectedDate && (auth === 'admin' || auth === 'user')) {
      fetchAttendance();
    }
  }, [selectedCategory, selectedDate, auth]);

  useEffect(() => {
    if (selectedCategory) {
      const studentsArray = Array.isArray(students) ? students : [];
      const filtered = studentsArray.filter(
        (student) =>
          student.category === selectedCategory || (student.category === null && selectedCategory === 'Sin categoría'),
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedCategory, students]);

  const fetchAttendance = async () => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await axios.get('http://localhost:4000/api/attendance/', {
        params: { date: formattedDate, category: selectedCategory },
        withCredentials: true,
      });
      const { attendance: attendanceData } = response.data;
      const newAttendance = {};
      const attendanceArray = Array.isArray(attendanceData) ? attendanceData : [];
      attendanceArray.forEach((item) => {
        if (item.present !== null) {
          newAttendance[item.idStudent] = item.present ? 'present' : 'absent';
        }
      });
      setAttendance(newAttendance);
      setOriginalAttendance(newAttendance);
      setIsAttendanceSaved(Object.keys(newAttendance).length > 0);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al obtener asistencia:', error);
      setAttendance({});
      setOriginalAttendance({});
      setIsAttendanceSaved(false);
      setIsEditing(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status === prev[studentId] ? null : status,
    }));
  };

  const handleAttendanceSubmit = async () => {
    if (!filteredStudents.length) {
      Swal.fire('Error', 'No hay estudiantes seleccionados para registrar la asistencia.', 'error');
      return;
    }
    if (!selectedDate || isNaN(new Date(selectedDate).getTime())) {
      Swal.fire('Error', 'Por favor, selecciona una fecha válida.', 'error');
      return;
    }
    if (!selectedCategory) {
      Swal.fire('Error', 'Por favor, selecciona una categoría.', 'error');
      return;
    }
    const validStudents = filteredStudents.filter((student) => student.id && student.name && student.lastName);
    if (!validStudents.length) {
      Swal.fire('Error', 'No hay estudiantes con datos completos para registrar la asistencia.', 'error');
      return;
    }
    const incompleteStudents = validStudents.filter((student) => !attendance[student.id]);
    if (incompleteStudents.length > 0) {
      Swal.fire('Error', 'Es necesario seleccionar el estado (presente o ausente) para todos los estudiantes.', 'error');
      return;
    }

    const attendanceData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      category: selectedCategory,
      attendance: validStudents.map((student) => ({
        idStudent: student.id,
        present: attendance[student.id] === 'present',
      })),
    };

    try {
      if (isAttendanceSaved) {
        await axios.put('http://localhost:4000/api/attendance/update', attendanceData, { withCredentials: true });
        Swal.fire('Éxito', 'Asistencia actualizada correctamente', 'success');
      } else {
        await axios.post('http://localhost:4000/api/attendance/create', attendanceData, { withCredentials: true });
        Swal.fire('Éxito', 'Asistencia registrada correctamente', 'success');
      }
      setIsAttendanceSaved(true);
      setIsEditing(false);
      setOriginalAttendance(attendance);
      fetchAttendance();
    } catch (error) {
      console.error('Error al guardar asistencia:', error);
      Swal.fire('Error', 'Ocurrió un error al guardar la asistencia. Por favor, intenta de nuevo.', 'error');
    }
  };

  const handleEditAttendance = () => {
    setOriginalAttendance({ ...attendance });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setAttendance({ ...originalAttendance });
    setIsEditing(false);
  };

  return (
    <div className="app-container">
      <h1>Registro de Asistencia</h1>
      <div className="content-container">
        <div className="category-selection">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
         
        </div>
        {selectedCategory && (
          <div className="attendance-section">
            <div className="attendance-header">
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                maxDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="attendance-date-input"
                locale={es}
                dropdownMode="select"
              />
              <button
                className="attendance-today-btn"
                onClick={() => setSelectedDate(new Date())}
              >
                Hoy
              </button>
            </div>
            {filteredStudents.length > 0 ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Nombre y Apellido</th>
                    <th>Presente</th>
                    <th>Ausente</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name} {student.lastName}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={attendance[student.id] === 'present'}
                          onChange={() => handleAttendanceChange(student.id, 'present')}
                          disabled={isAttendanceSaved && !isEditing}
                          className={isAttendanceSaved && !isEditing ? 'disabled-checkbox' : 'activated-checkbox'}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={attendance[student.id] === 'absent'}
                          onChange={() => handleAttendanceChange(student.id, 'absent')}
                          disabled={isAttendanceSaved && !isEditing}
                          className={isAttendanceSaved && !isEditing ? 'disabled-checkbox' : 'activated-checkbox'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-students-message">No hay alumnos registrados en la categoría {selectedCategory}</p>
            )}
            {filteredStudents.length > 0 && (
              <div className="attendance-buttons">
                {!isAttendanceSaved && (
                  <button className="attendance-save-btn" onClick={handleAttendanceSubmit}>
                    Guardar Asistencia
                  </button>
                )}
                {isAttendanceSaved && !isEditing && (
                  <button className="attendance-edit-btn" onClick={handleEditAttendance}>
                    Editar Asistencia
                  </button>
                )}
                {isEditing && (
                  <>
                    <button className="attendance-update-btn" onClick={handleAttendanceSubmit}>
                      Actualizar Asistencia
                    </button>
                    <button className="attendance-cancel-btn" onClick={handleCancelEdit}>
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <button className="attendance-back-btn" onClick={() => navigate(-1)}>
            Volver
          </button>
    </div>
  );
};

export default Attendance;