import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Companies from "../models/companiesModel.js";
import Users from "../models/userModel.js";
import Resumes from "../models/resumeModel.js";

export const applyJob = async (res, req, next) => {
    const { name, contact, email, about, profileUrl } = req.body;

    try {
        // validation
        if (!name || !email || !about || !contact || !profileUrl ) {
            next("Please Provide All Required Fields");
            return;
        }

        const resumePost = {
            name,
            contact,
            email,
            profileUrl,
            about,
            user: id,
        };
        const resume = new Resumes(resumePost)
        await resume.save()

        const { jobId } = req.params
        const job = await Jobs.findById(jobId);
        job.application.push(resume._id);
        await Jobs.findByIdAndUpdate(jobId, job, {
            new: true
        })
        
        res.status(200).json({
            success: true,
            message: "Apply Job Successfully",
            resume,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
}