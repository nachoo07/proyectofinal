import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StudentContext } from "../../context/student/StudentContext";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = location.pathname.endsWith("/new");
  const isEdit = new URLSearchParams(location.search).get("edit") === "true";
  const isView = !isNew && !isEdit && id;

  const { students, createStudent, updateStudent, fetchStudents  } = useContext(StudentContext);

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
    profileImage: "", // nombre de archivo o URL parcial
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
      const formattedDate = date.toISOString().substring(0, 10); // yyyy-MM-dd
      formData.set("birthDate", formattedDate); // <-- esta línea sobreescribe el valor anterior
    }

    if (file) {
      formData.append("profileImage", file);
    }

    try {
      if (isEdit) {
        await updateStudent(id, formData);
        alert("Estudiante actualizado");
      } else {
        await createStudent(formData);
        alert("Estudiante creado");
      }
      await fetchStudents();

      navigate("/");
    } catch (err) {
      console.error("Error al guardar estudiante:", err);
    }
  };
  const baseURL = "http://localhost:4000";

  return (
    <div className="container mt-4">
      <h2>{isNew ? "Nuevo Estudiante" : isView ? "Detalle del Estudiante" : "Editar Estudiante"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={student.name}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Apellido</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={student.lastName}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>DNI</label>
          <input
            type="text"
            className="form-control"
            name="dni"
            value={student.dni}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            className="form-control"
            name="birthDate"
            value={student.birthDate ? student.birthDate.substring(0, 10) : ""}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Dirección</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={student.address}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Nombre de la madre</label>
          <input
            type="text"
            className="form-control"
            name="motherName"
            value={student.motherName}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Nombre del padre</label>
          <input
            type="text"
            className="form-control"
            name="fatherName"
            value={student.fatherName}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Teléfono madre</label>
          <input
            type="text"
            className="form-control"
            name="motherPhone"
            value={student.motherPhone}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Teléfono padre</label>
          <input
            type="text"
            className="form-control"
            name="fatherPhone"
            value={student.fatherPhone}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Categoría</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={student.category}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="mail"
            value={student.mail}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <div className="mb-3">
          <label>Estado</label>
          <select
            name="state"
            className="form-select"
            value={student.state}
            onChange={handleChange}
            disabled={isView}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Comentario</label>
          <textarea
            name="comment"
            className="form-control"
            value={student.comment}
            onChange={handleChange}
            disabled={isView}
          ></textarea>
        </div>

        <div className="mb-3">
        <div className="mb-3">
          <label>Foto de perfil</label>
          <br />
          {student.profileImage && !student.profileImage.includes("pinimg.com") ? (
            // Imagen cargada desde el servidor (ruta relativa tipo /uploads/...)
            <img
              src={`http://localhost:4000${student.profileImage}`}
              alt="Imagen de perfil"
              style={{ maxWidth: "250px", borderRadius: "8px" }}
            />
          ) : (
            // Imagen por defecto (si no hay imagen cargada o es la por defecto desde la DB)
            <img
              src="https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg"
              alt="Imagen por defecto"
              style={{ maxWidth: "150px", borderRadius: "8px" }}
            />
          )}
        </div>

        
        
  

          {/* Input solo si no está en modo visualización */}
          {!isView && (
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          )}
        </div>


        {!isView && (
          <button type="submit" className="btn btn-primary">
            {isEdit ? "Actualizar" : "Crear"}
          </button>
        )}
      </form>
    </div>
  );
};

export default StudentDetail;
