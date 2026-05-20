import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidWR1YWtAZmFzeWxuZy5jb20iLCJyb2xlIjoiSEVBRE9GT1BTIiwiaWF0IjoxNzc5Mjg2NjI4LCJleHAiOjE3NzkyODc1MjgsImF1ZCI6ImZhc3lsLXVzZXJzIiwiaXNzIjoiZmFzeWwtcG1vIn0.qsA_GcCvEyf9Vlk4DsKQNwf4WOhRON8rh_bQ7TRvS-Y"

const projects = [
    {
        name: "ERP System Upgrade",
        clientName: "Fasyl Finance Ltd",
        industry: "Financial Technology",
        productName: "ERP Core Platform",
        description:"Internal ERP modernization project",
        projectManagerEmail: "sekemi@fasylng.com"
    },
    {
        name: "Cybersecurity Upgrade Initiative",
        clientName: "Fasyl Security",
        industry: "Cybersecurity",
        productName: "Security Suite",
        description:"Internal ERP modernization project",
        projectManagerEmail: "desmond@fasylng.com"
    },
    {
        name: "Cybersecurity Initiative",
        clientName: "Fasyl Security",
        industry: "Cybersecurity",
        productName: "Security Intel",
        description:"Internal ERP modernization project",
        projectManagerEmail: "joel@fasylng.com"
    }
]

const createProject = async () => {
    try {
        for (const project of projects) {
            const { data } = await axios.post("http://localhost:5000/api/projects", project, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(data)
            console.log("Created: ", data.project.projectName)
        }

        console.log("All projects created successfully");

    } catch (error) {
        console.error("FULL ERROR:", error);
        console.error("Message:", error.message);
        console.error("Response data:", error.response?.data);
        console.error("Status:", error.response?.status);
    }
};

createProject();