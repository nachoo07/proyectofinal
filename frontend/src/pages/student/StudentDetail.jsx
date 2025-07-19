import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StudentContext } from "../../context/student/StudentContext";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextareaAutosize,
  Avatar,
  Stack,
  Divider
} from "@mui/material";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = location.pathname.endsWith("/new");
  const isEdit = new URLSearchParams(location.search).get("edit") === "true";
  const isView = !isNew && !isEdit && id;

  const { students, createStudent, updateStudent, fetchStudents } = useContext(StudentContext);

  const [student, setStudent] = useState({
    name: "",
    lastName: "",
    dni: "",
    birthDate: "",
    address: "",
    motherName: "",
    fatherName: "",
    motherPhone: "",
    fatherPhone: "",
    category: "",
    mail: "",
    state: "Activo",
    comment: "",
    profileImage: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if ((isEdit || isView) && id && students.length > 0) {
      const found = students.find((s) => s.id === parseInt(id));
      if (found) {
        setStudent(found);
        if (found.profileImage) {
          setImagePreview(`http://localhost:4000/uploads/${found.profileImage}`);
        }
      }
    }
  }, [id, isEdit, isView, students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in student) {
      formData.append(key, student[key]);
    }

    if (student.birthDate) {
      const date = new Date(student.birthDate);
      const formattedDate = date.toISOString().substring(0, 10);
      formData.set("birthDate", formattedDate);
    }

    if (file) {
      formData.append("profileImage", file);
    }

    if (student.motherPhone && student.motherPhone.length < 10) {
      toast.error("El teléfono de la madre debe tener al menos 10 caracteres");
      return;
    }

    if (student.fatherPhone && student.fatherPhone.length < 10) {
      toast.error("El teléfono del padre debe tener al menos 10 caracteres");
      return;
    }

    try {
      if (isEdit) {
        await updateStudent(id, formData);
        toast.success("Estudiante actualizado");
      } else {
        await createStudent(formData);
        toast.success("Estudiante creado");
      }
      await fetchStudents();
      navigate("/students");
    } catch (err) {
      const errorMessage = err?.response?.data?.error || "Error al guardar el estudiante";
      toast.error(errorMessage);
    }
  };

  return (
    <Box maxWidth="1000px" mx="auto" p={{ xs: 3, md: 5 }} mt={4} bgcolor="white" borderRadius={4} boxShadow={3}>
      {isView && (
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" gutterBottom>Detalle del Estudiante</Typography>
          <Avatar
            src={
              student.profileImage && !student.profileImage.includes("pinimg.com")
                ? `http://localhost:4000${student.profileImage}`
                : "https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg"
            }
            alt="Foto de perfil"
            sx={{ width: 120, height: 120, mx: "auto", mb: 1 }}
          />
          <Typography variant="h6">{student.name} {student.lastName}</Typography>
          <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
            Volver atrás
          </Button>
          <Divider sx={{ my: 3 }} />
        </Box>
      )}

      {!isView && (
        <Typography variant="h5" gutterBottom textAlign="center">
          {isEdit ? "Editar Estudiante" : "Nuevo Estudiante"}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {!isView && (
            <>
              <TextField
                label="Nombre"
                name="name"
                value={student.name}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Apellido"
                name="lastName"
                value={student.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </>
          )}

          <TextField
            label="DNI"
            name="dni"
            value={student.dni}
            onChange={handleChange}
            fullWidth
            required
            disabled={isView}
          />

          <TextField
            label="Fecha de nacimiento"
            type="date"
            name="birthDate"
            value={student.birthDate ? student.birthDate.substring(0, 10) : ""}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={isView}
          />

          <TextField
            label="Dirección"
            name="address"
            value={student.address}
            onChange={handleChange}
            fullWidth
            disabled={isView}
          />

          <TextField
            label="Email"
            name="mail"
            type="email"
            value={student.mail}
            onChange={handleChange}
            fullWidth
            disabled={isView}
          />

          <TextField
            label="Categoría"
            name="category"
            value={student.category}
            onChange={handleChange}
            fullWidth
            disabled={isView}
          />

          <FormControl fullWidth disabled={isView}>
            <InputLabel>Estado</InputLabel>
            <Select
              name="state"
              value={student.state}
              onChange={handleChange}
              label="Estado"
            >
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Nombre de la madre"
            name="motherName"
            value={student.motherName}
            onChange={handleChange}
            fullWidth
            disabled={isView}
          />
          <TextField
            label="Teléfono madre"
            name="motherPhone"
            value={student.motherPhone}
            onChange={handleChange}
            fullWidth
            disabled={isView}
          />
          <TextField
            label="Nombre del padre"
            name="fatherName"
            value={student.fatherName}
            onChange={handleChange}
            fullWidth
            disabled={isView}
          />
          <TextField
            label="Teléfono padre"
            name="fatherPhone"
            value={student.fatherPhone}
            onChange={handleChange}
            fullWidth
            disabled={isView}
          />

          <TextField
            label="Comentario"
            name="comment"
            multiline
            minRows={3}
            value={student.comment}
            onChange={handleChange}
            fullWidth
            disabled={isView}
          />

          {!isView && (
            <Box textAlign="center">
              {imagePreview && (
                <Avatar
                  src={imagePreview}
                  alt="Preview"
                  sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                />
              )}
              <Button variant="outlined" component="label">
                Subir Foto
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
            </Box>
          )}

          {!isView && (
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              <Button type="submit" variant="contained" color="primary">
                {isEdit ? "Actualizar" : "Crear"}
              </Button>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Volver
              </Button>
            </Stack>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default StudentDetail;
