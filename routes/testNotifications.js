const bodyParser = require("body-parser");
const express = require("express");
const axios = require("axios");


const app = express();
const PORT = 3000;

 
app.use(bodyParser.json());

app.post("/send-noti", async (req, res) => {
    const { token, title, body } = req.body;

    try {
        const result = await axios.post(
            "https://exp.host/--/api/v2/push/send",
            {
                to: token,
                title,
                body,
                sound: "default",
                priority: "high",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        res.json(result.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send("Lỗi khi gửi notification");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
