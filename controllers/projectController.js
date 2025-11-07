import asyncHandler from "express-async-handler";
import Project from "../models/projectModel.js";


const createProject = asyncHandler(async (req, res) => {
    try{
        const project =  new Project({
            name: req.body.name,
            files: req.body.files
        })
        await project.save();
         res
      .status(200)
      .json({ status: true, project, message: "Project created successfully." });
    } catch(error) {
       console.log(error);
       return res.status(500).json({ status: false, message: error.message });
    }
});


const updateProject = asyncHandler(async (req, res) => {
     const { id } = req.params;

     try {
       const project =  await Project.findById(id);
       if(!project){
        return res.status(404).json({
            status: false,
            message: 'Project not found.'
        })
        }
        project.name = req.body.name || project.name
        project.structure = req.body.structure || project.structure
        await project.save();
        res.status(200).json({
            status: true,
            project,
            message: "Project updated successfully."
        })
     } catch (error){
      console.log(error);
       return res.status(500).json({ status: false, message: error.message });
     }
});

const getProject = asyncHandler(async (req, res) => {
    try {
     const { id } = req.params;
     const project =  await Project.findById(id);
       if(!project){
        return res.status(404).json({
            status: false,
            message: 'Project not found.'
        })
        }
     res.status(200).json({
            status: true,
            project
        })

    } catch(error) {
         console.log(error);
       return res.status(500).json({ status: false, message: error.message });
  
    }
})

export {
    createProject,
    updateProject,
    getProject
};
