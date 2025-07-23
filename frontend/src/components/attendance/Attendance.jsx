import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import Swal from 'sweetalert2';
import { LoginContext } from '../../context/login/LoginContext';
import { StudentContext } from '../../context/student/StudentContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Checkbox,
} from '@mui/material';

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

  // Estado para contar presentes y ausentes
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });

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

  // Actualizar estadísticas de asistencia cuando cambie attendance o filteredStudents
  useEffect(() => {
    const presentCount = filteredStudents.filter((student) => attendance[student.id] === 'present').length;
    const absentCount = filteredStudents.filter((student) => attendance[student.id] === 'absent').length;
    setAttendanceStats({ present: presentCount, absent: absentCount });
  }, [attendance, filteredStudents]);

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
    <Box
      sx={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #b2dfdb 100%)',
        minHeight: '100vh',
        p: { xs: 1, md: 2, lg: 2 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          mb: 1,
          p: 1,
          borderRadius: '16px',
          background: '#e8f5e9',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            color: 'rgba(32, 129, 38, 1)',
            letterSpacing: '0.08rem',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
            textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
          }}
        >
          Registro de Asistencia
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          maxWidth: '1200px',
          mb: { xs: 2, md: 3 },
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: '32px',
            fontWeight: 600,
            fontSize: { xs: '0.8rem', md: '1rem' },
            px: { xs: 1.5, md: 3 },
            py: { xs: 0.5, md: 1 },
            minWidth: { xs: '120px', md: '160px' },
            color: '#1b5e20',
            borderColor: '#1b5e20',
            '&:hover': {
              backgroundColor: 'rgba(142, 234, 177, 0.1)',
              borderColor: '#43e97b',
            },
          }}
        >
          Volver
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          mb: { xs: 2, md: 4 },
          flexWrap: 'wrap',
          gap: { xs: 1, md: 2 },
          width: '100%',
          maxWidth: '1200px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(56, 249, 215, 0.08)',
          p: { xs: 1, md: 2 },
        }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'contained' : 'outlined'}
            onClick={() => setSelectedCategory(category)}
            sx={{
              background: selectedCategory === category ? '#4caf50' : '#05a8be',
              color: selectedCategory === category ? '#ffffff' : 'rgb(243, 242, 247)',
              borderColor: '#38f9d7',
              borderRadius: '12px',
              px: { xs: 2, md: 3 },
              py: { xs: 0.5, md: 1 },
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              fontWeight: 700,
              minWidth: '100px',
              '&:hover': {
                borderColor: '#4bcfa5',
                background: selectedCategory === category ? '#388e3c' : 'rgba(5, 100, 190, 0.8)',
              },
            }}
          >
            {category}
          </Button>
        ))}
      </Box>

      {selectedCategory && (
        <Box sx={{ width: '100%', maxWidth: '1200px' }}>
          <Typography
            sx={{
              textAlign: 'center',
              color: '#1b5e20',
              fontWeight: 600,
              fontSize: { xs: '0.875rem', md: '1rem' },
              mb: { xs: 1, md: 2 },
            }}
          >
            Alumnos: {filteredStudents.length} | Presentes: {attendanceStats.present} | Ausentes: {attendanceStats.absent}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 2 },
              mb: { xs: 2, md: 3 },
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              maxDate={new Date()}
              dateFormat="dd/MM/yyyy"
              locale={es}
              dropdownMode="select"
              customInput={
                <TextField
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      border: '1px solid #38f9d7',
                      background: '#fff',
                      '& fieldset': { borderColor: '#38f9d7' },
                      '&:hover fieldset': { borderColor: '#43e97b' },
                      '&.Mui-focused fieldset': { borderColor: '#43e97b' },
                    },
                    '& .MuiInputLabel-root': { color: '#1b5e20', fontWeight: 600 },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
                    minWidth: { xs: '140px', md: '160px' },
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                  }}
                  size={window.innerWidth < 768 ? 'small' : 'medium'}
                />
              }
            />
            <Button
              variant="contained"
              onClick={() => setSelectedDate(new Date())}
              sx={{
                background: '#4caf50',
                color: '#fff',
                borderRadius: '32px',
                px: { xs: 2, md: 3 },
                py: { xs: 0.5, md: 1 },
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                fontWeight: 600,
                '&:hover': { background: '#388e3c' },
              }}
            >
              Hoy
            </Button>
          </Box>

          {filteredStudents.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                mb: 4,
                borderRadius: '16px',
                boxShadow: '0 6px 24px rgba(67, 233, 123, 0.10)',
                overflow: 'auto',
                width: '100%',
                maxWidth: '1200px',
                mx: 'auto',
              }}
            >
              <Table sx={{ minWidth: { xs: 320, md: 650 } }}>
                <TableHead>
                  <TableRow sx={{ background: '#208126ff' }}>
                    <TableCell
                      sx={{
                        color: '#ffffffff',
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', md: '1.1rem' },
                        borderTopLeftRadius: '16px',
                        textAlign: 'center',
                        p: { xs: 0.5, md: 2 },
                      }}
                    >
                      Nombre y Apellido
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#ffffffff',
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', md: '1.1rem' },
                        textAlign: 'center',
                        p: { xs: 0.5, md: 2 },
                      }}
                    >
                      Presente
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#ffffffff',
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', md: '1.1rem' },
                        borderTopRightRadius: '16px',
                        textAlign: 'center',
                        p: { xs: 0.5, md: 2 },
                      }}
                    >
                      Ausente
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow
                      key={student.id}
                      sx={{
                        background: index % 2 === 0 ? '#f8fafc' : '#e0f7fa',
                        transition: 'background 0.2s',
                        '&:hover': { background: '#b2dfdb' },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: '#1b5e20',
                          fontWeight: 500,
                          textAlign: 'center',
                          fontSize: { xs: '0.75rem', md: '1rem' },
                          p: { xs: 0.5, md: 2 },
                        }}
                      >
                        {student.name} {student.lastName}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: 'center',
                          p: { xs: 0.5, md: 2 },
                        }}
                      >
                        <Checkbox
                          checked={attendance[student.id] === 'present'}
                          onChange={() => handleAttendanceChange(student.id, 'present')}
                          disabled={isAttendanceSaved && !isEditing}
                          sx={{
                            color: isAttendanceSaved && !isEditing ? '#bdbdbd' : '#4caf50',
                            '&.Mui-checked': { color: '#4caf50' },
                            '&.Mui-disabled': { color: '#bdbdbd' },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: 'center',
                          p: { xs: 0.5, md: 2 },
                        }}
                      >
                        <Checkbox
                          checked={attendance[student.id] === 'absent'}
                          onChange={() => handleAttendanceChange(student.id, 'absent')}
                          disabled={isAttendanceSaved && !isEditing}
                          sx={{
                            color: isAttendanceSaved && !isEditing ? '#bdbdbd' : '#4caf50',
                            '&.Mui-checked': { color: '#4caf50' },
                            '&.Mui-disabled': { color: '#bdbdbd' },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              sx={{
                textAlign: 'center',
                color: '#1b5e20',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', md: '1.1rem' },
                my: { xs: 2, md: 3 },
              }}
            >
              No hay alumnos registrados en la categoría {selectedCategory}
            </Typography>
          )}

          {filteredStudents.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 1, md: 2 },
                justifyContent: 'flex-end',
                mt: { xs: 2, md: 3 },
                flexWrap: 'wrap',
              }}
            >
              {!isAttendanceSaved && (
                <Button
                  variant="contained"
                  onClick={handleAttendanceSubmit}
                  sx={{
                    background: '#4caf50',
                    color: '#fff',
                    borderRadius: '32px',
                    px: { xs: 2, md: 3 },
                    py: { xs: 0.5, md: 1 },
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    fontWeight: 600,
                    '&:hover': { background: '#388e3c' },
                  }}
                >
                  Guardar Asistencia
                </Button>
              )}
              {isAttendanceSaved && !isEditing && (
                <Button
                  variant="contained"
                  onClick={handleEditAttendance}
                  sx={{
                    background: '#0288d1',
                    color: '#fff',
                    borderRadius: '32px',
                    px: { xs: 2, md: 3 },
                    py: { xs: 0.5, md: 1 },
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    fontWeight: 600,
                    '&:hover': { background: '#01579b' },
                  }}
                >
                  Editar Asistencia
                </Button>
              )}
              {isEditing && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleAttendanceSubmit}
                    sx={{
                      background: '#388e3c',
                      color: '#fff',
                      borderRadius: '32px',
                      px: { xs: 2, md: 3 },
                      py: { xs: 0.5, md: 1 },
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      fontWeight: 600,
                      '&:hover': { background: '#2e7d32' },
                    }}
                  >
                    Actualizar Asistencia
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCancelEdit}
                    sx={{
                      background: '#d32f2f',
                      color: '#fff',
                      borderRadius: '32px',
                      px: { xs: 2, md: 3 },
                      py: { xs: 0.5, md: 1 },
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      fontWeight: 600,
                      '&:hover': { background: '#b71c1c' },
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Attendance;