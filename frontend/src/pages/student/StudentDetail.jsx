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
  Avatar,
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

    // Validaciones nuevas:
    if (!student.address || student.address.trim() === "") {
      toast.error("La dirección es obligatoria");
      return;
    }
    if (!student.birthDate || student.birthDate.trim() === "") {
      toast.error("La fecha de nacimiento es obligatoria");
      return;
    }

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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9 0%, #b2dfdb 100%)",
        p: { xs: 1, sm: 2, md: 4 },
      }}
    >
      <Box
        maxWidth="1200px"
        mx="auto"
        sx={{
          bgcolor: "white",
          borderRadius: { xs: "12px", md: "20px" },
          boxShadow: "0 12px 40px rgba(67, 233, 123, 0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header con título y avatar */}
        <Box
          sx={{
            background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
            p: { xs: 2, sm: 3, md: 4 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#00335c",
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.5rem" },
            }}
          >
            {isView
              ? "Detalle del Estudiante"
              : isEdit
              ? "Editar Estudiante"
              : "Nuevo Estudiante"}
          </Typography>

          {isView && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "column", md: "row" },
                gap: { xs: 2, sm: 3, md: 4 },
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              {/* Foto de perfil */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Avatar
                  src={
                    student.profileImage &&
                    !student.profileImage.includes("pinimg.com")
                      ? `http://localhost:4000${student.profileImage}`
                      : "https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg"
                  }
                  alt="Foto de perfil"
                  sx={{
                    width: { xs: 100, sm: 120, md: 150 },
                    height: { xs: 100, sm: 120, md: 150 },
                    border: "4px solid white",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>

              {/* Nombre y apellido */}
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#00335c",
                    fontWeight: 600,
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  }}
                >
                  {student.name} {student.lastName}
                </Typography>
              </Box>

              {/* Botón volver */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate(-1)}
                  sx={{
                    bgcolor: "white",
                    color: "#00335c",
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    borderRadius: "25px",
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  Volver atrás
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Contenido principal */}
        <Box p={{ xs: 2, sm: 3, md: 5 }}>
          <form onSubmit={handleSubmit}>
            {/* Información personal */}
            <Box mb={4}>
              <Typography
                variant="h5"
                sx={{
                  color: "#00335c",
                  fontWeight: 700,
                  mb: 3,
                  borderBottom: "2px solid #43e97b",
                  pb: 1,
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                }}
              >
                Información Personal
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={{ xs: 2, sm: 2.5, md: 3 }}
              >
                {!isView && (
                  <>
                    <TextField
                      label="Nombre"
                      name="name"
                      value={student.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      size="medium"
                    />
                    <TextField
                      label="Apellido"
                      name="lastName"
                      value={student.lastName}
                      onChange={handleChange}
                      fullWidth
                      required
                      size="medium"
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
                  size="medium"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#535252ff",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#535252ff",
                    },
                  }}
                />

                <TextField
                  label="Fecha de nacimiento"
                  type="date"
                  name="birthDate"
                  value={student.birthDate ? student.birthDate.substring(0, 10) : ""}
                  onChange={handleChange}
                  fullWidth
                  disabled={isView}
                  size="medium"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#535252ff",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#535252ff",
                    },
                  }}
                />

                <TextField
                  label="Email"
                  name="mail"
                  type="email"
                  value={student.mail}
                  onChange={handleChange}
                  fullWidth
                  disabled={isView}
                  size="medium"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#535252ff",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#535252ff",
                    },
                  }}
                />

                <TextField
                  label="Categoría"
                  name="category"
                  value={student.category}
                  onChange={handleChange}
                  fullWidth
                  disabled={isView}
                  size="medium"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#535252ff",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#535252ff",
                    },
                  }}
                />

                <FormControl fullWidth disabled={isView} size="medium">
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
              </Box>

              <Box mt={3}>
                <TextField
                  label="Dirección"
                  name="address"
                  value={student.address}
                  onChange={handleChange}
                  fullWidth
                  disabled={isView}
                  size="medium"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#535252ff",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#535252ff",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Información de contacto familiar */}
            <Box mb={4}>
              <Typography
                variant="h5"
                sx={{
                  color: "#00335c",
                  fontWeight: 700,
                  mb: 3,
                  borderBottom: "2px solid #43e97b",
                  pb: 1,
                }}
              >
                Información Familiar
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }}
                gap={{ xs: 2, md: 3 }}
              >
                <TextField
                  label="Nombre de la madre"
                  name="motherName"
                  value={student.motherName}
                  onChange={handleChange}
                  fullWidth
                  disabled={isView}
                  size="medium"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#535252ff",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#535252ff",
                    },
                  }}
                />
                <TextField
                  label="Teléfono madre"
                  name="motherPhone"
                  value={student.motherPhone}
                  onChange={handleChange}
                  fullWidth
                  disabled={isView}
                  size="medium"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#535252ff",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#535252ff",
                    },
                  }}
                />
                <TextField
                  label="Nombre del padre"
                  name="fatherName"
                  value={student.fatherName}
                  onChange={handleChange}
                  fullWidth
                  disabled={isView}
                  size="medium"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#535252ff",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#535252ff",
                    },
                  }}
                />
                <TextField
                  label="Teléfono padre"
                  name="fatherPhone"
                  value={student.fatherPhone}
                  onChange={handleChange}
                  fullWidth
                  disabled={isView}
                  size="medium"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#535252ff",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#535252ff",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Información adicional */}
            <Box mb={4}>
              <Typography
                variant="h5"
                sx={{
                  color: "#00335c",
                  fontWeight: 700,
                  mb: 3,
                  borderBottom: "2px solid #43e97b",
                  pb: 1,
                }}
              >
                Información Adicional
              </Typography>

              <TextField
                label="Comentario"
                name="comment"
                multiline
                minRows={4}
                value={student.comment}
                onChange={handleChange}
                fullWidth
                disabled={isView}
                size="medium"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "#535252ff",
                    fontWeight: "bold",
                    WebkitTextFillColor: "#535252ff",
                  },
                }}
              />
            </Box>

            {/* Foto de perfil */}
            {!isView && (
              <Box
                mb={4}
                sx={{
                  textAlign: "center",
                  p: 3,
                  border: "2px dashed #43e97b",
                  borderRadius: "12px",
                  bgcolor: "#f8fffe",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#00335c",
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  Foto de Perfil
                </Typography>

                {imagePreview && (
                  <Avatar
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: { xs: 120, md: 150 },
                      height: { xs: 120, md: 150 },
                      mx: "auto",
                      mb: 3,
                      border: "3px solid #43e97b",
                    }}
                  />
                )}
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    bgcolor: "#43e97b",
                    color: "#00335c",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: "25px",
                    "&:hover": {
                      bgcolor: "#38f9d7",
                    },
                  }}
                >
                  {imagePreview ? "Cambiar Foto" : "Subir Foto"}
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
              </Box>
            )}

            {/* Botones de acción */}
            {!isView && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: { xs: 2, md: 3 },
                  flexDirection: { xs: "column", sm: "row" },
                  mt: 4,
                  p: 3,
                  bgcolor: "#f8fffe",
                  borderRadius: "12px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#43e97b",
                    color: "#00335c",
                    fontWeight: 700,
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 2 },
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    borderRadius: "25px",
                    minWidth: { xs: "100%", sm: "180px" },
                    "&:hover": {
                      bgcolor: "#38f9d7",
                    },
                  }}
                >
                  {isEdit ? "Actualizar" : "Crear"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{
                    color: "#00335c",
                    borderColor: "#43e97b",
                    fontWeight: 700,
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 2 },
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    borderRadius: "25px",
                    minWidth: { xs: "100%", sm: "180px" },
                    "&:hover": {
                      bgcolor: "rgba(67, 233, 123, 0.1)",
                      borderColor: "#38f9d7",
                    },
                  }}
                >
                  Volver
                </Button>
              </Box>
            )}
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentDetail;
