import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StudentContext } from "../../context/student/StudentContext";
import { toast } from "react-toastify";

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
    <div className="container mt-4 text-center">

      {/* Imagen, nombre y botones arriba si está en modo vista */}
      {isView && (
  <div className="d-flex justify-content-center align-items-center gap-4 mb-4 flex-wrap">
    {/* Imagen */}
    <div className="text-center">
      
       <h2 className="mb-4">
        {isNew ? "Nuevo Estudiante" : isView ? "Detalle del Estudiante" : "Editar Estudiante"}
      </h2>

      <img
        src={
          student.profileImage && !student.profileImage.includes("pinimg.com")
            ? `http://localhost:4000${student.profileImage}`
            : "https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg"
        }
        alt="Foto de perfil"
        style={{ maxWidth: "180px", borderRadius: "8px" }}
      />
      <h3 className="mt-3">{student.name} {student.lastName}</h3>
    </div>

    {/* Botones */}
    <div className="d-flex flex-column gap-2">
     
      <button className="btn btn btn-primary" onClick={() => navigate(-1)}>
        Volver atrás
      </button>

      
    </div>
  </div>
)}

     

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
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
          <div className="col-md-4">
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
          <div className="col-md-4">
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
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
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
          <div className="col-md-4">
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
          <div className="col-md-4">
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
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
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
          <div className="col-md-4">
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
          <div className="col-md-4">
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
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
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
          <div className="col-md-6">
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

        {/* Foto y carga solo para crear/editar */}
        {!isView && (
          <div className="mb-3">
            <label>Foto de perfil</label>
            <br />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Vista previa"
                style={{ maxWidth: "250px", borderRadius: "8px" }}
              />
            ) : null}
            <input
              type="file"
              className="form-control mt-2"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}

        {/* Botones Crear/Editar */}
        {!isView && (
          <div className="d-flex gap-2 mt-3 justify-content-center">
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i> Volver
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentDetail;
