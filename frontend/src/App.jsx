

const App = () => {
  return (

  );
};

// Vista principal con la tabla
const Home = () => {
  const { students, deleteStudent } = useContext(StudentContext);
  return <StudentTable students={students} onDelete={deleteStudent} />;
};

export default App;
