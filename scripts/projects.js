import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsInJvbGUiOiJIRUFET0ZPUFMiLCJpYXQiOjE3NzgwMzI1NDAsImV4cCI6MTc3ODAzMzQ0MCwiYXVkIjoiZmFzeWwtdXNlcnMiLCJpc3MiOiJmYXN5bC1wbW8ifQ.skjxfUcPzKvR0hBOHrfW1fsNCsMkCO_BHY2yFfHPzG0"

const projects = [
    {
        name: "ERP System Upgrade",
        clientName: "Fasyl Finance Ltd",
        industry: "Financial Technology",
        productName: "ERP Core Platform",
        projectManager: "sekemi@fasylng.com"
    },
    {
        name: "Cybersecurity Upgrade Initiative",
        clientName: "Fasyl Security",
        industry: "Cybersecurity",
        productName: "Security Suite",
        projectManager: "desmond@fasylng.com"
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