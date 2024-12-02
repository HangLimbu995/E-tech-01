import formidable from "formidable"; // Default export in v3.x

const formidableMiddleware = (req, res, next) => {
    const form = formidable({ multiples: true }); // Create a form instance (v3.x+)
    form.parse(req, (err, fields, files) => {
        console.log("formidable")
        if (err) {
            console.error("Formidable error:", err);
            return res.status(400).json({ success: false, message: "Error parsing form data!" });
        }
        
        req.fields = fields; // Attach parsed fields to the request object
        req.files = files; // Attach parsed files to the request object
        next(); // Pass control to the next middleware
    });
};

export default formidableMiddleware;
