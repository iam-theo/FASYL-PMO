import axios from "axios";


const users = [
    {
        email: "uduak@fasylng.com",
        password: "123456",
        fullName: "Mrs Uduak",
        role: "HEADOFOPS"
    },
    {
        email: "sekemi@fasylng.com",
        password: "123456",
        fullName: "Sekemi Ariyibi",
        role: "PROJECTMANAGER"
    },
    {
        email: "desmond@fasylng.com",
        password: "123456",
        fullName: "Desmond Theo",
        role: "PROJECTMANAGER"
    }
]

const createUsers = async () => {
    try {
        for (const user of users) {
            const { data } = await axios.post("http://localhost:5000/api/auth/register", user)
            // console.log(data)
        }

        console.log("All users created successfully");

    } catch (error) {
        console.error("FULL ERROR:", error);
        console.error("Message:", error.message);
        console.error("Response data:", error.response?.data);
        console.error("Status:", error.response?.status);
    }
};

createUsers();