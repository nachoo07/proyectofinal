import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StudentContext } from "../../context/student/StudentContext";

const StudentDetail = ({ isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { students, createStudent, updateStudent } = useContext(StudentContext);

  const isEdit = new URLSearchParams(location.search).get("edit") === "true";

  const [student, setStudent] = useState({
    name: "",
    lastname: "",
    dni: "",
    birthdate: "",
    category: "",
    address: "",
    tutor1_name: "",
    tutor1_phone: "",
    tutor2_name: "",
    tutor2_phone: "",
    observations: "",
  });

  useEffect(() => {
    if (!isNew && id) {
      const stud = students.find((s) => s.id.toString() === id.toString());
      if (stud) {
        setStudent({
          name: stud.name || "",
          lastname: stud.lastName || "",
          dni: stud.dni || "",
          birthdate: stud.birthDate || "",
          category: stud.category || "",
          address: stud.address || "",
          tutor1_name: stud.motherName || "",
          tutor1_phone: stud.motherPhone || "",
          tutor2_name: stud.fatherName || "",
          tutor2_phone: stud.fatherPhone || "",
          observations: stud.comment || "",
        });
      }
    }
  }, [id, isNew, students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: student.name,
      lastName: student.lastname,
      dni: student.dni,
      birthDate: student.birthdate,
      category: student.category,
      address: student.address,
      motherName: student.tutor1_name,
      motherPhone: student.tutor1_phone,
      fatherName: student.tutor2_name,
      fatherPhone: student.tutor2_phone,
      comment: student.observations,
    };

    try {
      if (isNew) {
        await createStudent(payload);
        alert("Estudiante creado con éxito");
      } else {
        await updateStudent(id, payload);
        alert("Estudiante actualizado con éxito");
      }
      navigate("/");
    } catch (error) {
      alert("Error al guardar el estudiante: " + error.message);
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>
        {isNew
          ? "Nuevo Estudiante"
          : isEdit
          ? "Editar Estudiante"
          : "Detalle del Estudiante"}
      </h1>

      <form onSubmit={handleSubmit}>
        {[
          { label: "Nombre", name: "name" },
          { label: "Apellido", name: "lastname" },
          { label: "DNI", name: "dni" },
          { label: "Fecha de Nacimiento", name: "birthdate", type: "date" },
          { label: "Categoría", name: "category" },
          { label: "Dirección", name: "address" },
          { label: "Nombre del Tutor 1", name: "tutor1_name" },
          { label: "Teléfono del Tutor 1", name: "tutor1_phone" },
          { label: "Nombre del Tutor 2", name: "tutor2_name" },
          { label: "Teléfono del Tutor 2", name: "tutor2_phone" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name} style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>{label}</label>
            <input
              type={type}
              name={name}
              value={
                name === "birthdate" && student.birthdate
                  ? student.birthdate.slice(0, 10)
                  : student[name] || ""
              }
              onChange={handleChange}
              disabled={!isNew && !isEdit}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
        ))}

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>Observaciones</label>
          <textarea
            name="observations"
            value={student.observations || ""}
            onChange={handleChange}
            disabled={!isNew && !isEdit}
            rows="4"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="button" onClick={() => navigate("/")}>
            Volver
          </button>
          {(isNew || isEdit) ? (
            <button type="submit">Guardar</button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(`/students/${id}?edit=true`)}
            >
              Editar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentDetail;
