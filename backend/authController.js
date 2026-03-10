const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {

const { email, password } = req.body;

// Admin from ENV
if (
email === process.env.ADMIN_EMAIL &&
password === process.env.ADMIN_PASSWORD
) {

const token = jwt.sign(
{
email,
role: "superadmin"
},
process.env.JWT_SECRET,
{ expiresIn: "2h" }
);

return res.json({
message: "Login successful",
token,
role: "superadmin"
});

}

// Future admin users from DB could go here

return res.status(401).json({
message: "Invalid credentials"
});

};