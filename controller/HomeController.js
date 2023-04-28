const express = require('express');
const router = express.Router();

router.get(`/`, (req, res) => {
    res.render(`index`, {
        title: "Página Inicial"
    });
});

module.exports = router;