import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidWR1YWtAZmFzeWxuZy5jb20iLCJyb2xlIjoiSEVBRE9GT1BTIiwiaWF0IjoxNzc5MzQ1MjA0LCJleHAiOjE3NzkzNDYxMDQsImF1ZCI6ImZhc3lsLXVzZXJzIiwiaXNzIjoiZmFzeWwtcG1vIn0.zVz9QujkYcUjyQRmQdq9c8lE7R2Vl3XtKknSTU7IRnA"

const projects = [
    {
        name: "ERP System Upgrade",
        clientName: "Fasyl Finance Ltd",
        industry: "Financial Technology",
        productName: "ERP Core Platform",
        description:"Internal ERP modernization project"
    },
    {
        name: "Cybersecurity Upgrade Initiative",
        clientName: "Fasyl Security",
        industry: "Cybersecurity",
        productName: "Security Suite",
        description:"Internal ERP modernization project"
    },
    {
        name: "Cybersecurity Initiative",
        clientName: "Fasyl Security",
        industry: "Cybersecurity",
        productName: "Security Intel",
        description:"Internal ERP modernization project"
    },
    {
        name: "Digital Banking Transformation",
        clientName: "NovaTrust Bank",
        industry: "Banking",
        productName: "Digital Banking Platform",
        description: "Migration of legacy banking services to a modern digital platform"
    },
    {
        name: "Core Infrastructure Modernization",
        clientName: "Apex Microfinance",
        industry: "Microfinance",
        productName: "Infrastructure Suite",
        description: "Upgrade of on-prem infrastructure and deployment automation systems"
    },
    {
        name: "Customer Experience Optimization",
        clientName: "Velocity Telecom",
        industry: "Telecommunications",
        productName: "CX Analytics Platform",
        description: "Implementation of customer analytics and engagement monitoring tools"
    }
]

const createProject = async () => {
    try {
        for (const project of projects) {
            const { data: response } = await axios.post("http://localhost:5000/api/projects", project, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(data)
            console.log("Created: ", response.data.projectName)
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