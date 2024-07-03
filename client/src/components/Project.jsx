import React from 'react';

const Projects = ({ projects }) => {
  return (
    <div className="projects-container">
      {projects.map((prj, index) => (
        <div key={index} className="project-item">
          <h2>{prj.prj_name}</h2>
          <p>Created on: {prj.creation_date}</p>
          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
};

export default Projects;
