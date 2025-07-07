import './homeAdmin.css';

const HomeAdmin = () => {
  return (
    <>
      <h1>hola mundo</h1>
      <div className="card-container">
        <div className="custom-card">
          <h2>Título de la Card 1</h2>
          <p>Este es el contenido de la primera card.</p>
        </div>
        <div className="custom-card">
          <h2>Título de la Card 2</h2>
          <p>Este es el contenido de la segunda card.</p>
        </div>
      </div>
    </>
  );
};

export default HomeAdmin;