const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to check if a string is a number
function isNumber(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

// Helper function to check if a string contains only alphabets
function isAlphabet(str) {
    return /^[a-zA-Z]+$/.test(str);
}

// Helper function to check if a string contains special characters
function hasSpecialCharacters(str) {
    return /[^a-zA-Z0-9]/.test(str);
}

// Helper function to create alternating caps concatenation
function createAlternatingCaps(alphabets) {
    // Extract all alphabetical characters and reverse the order
    let allChars = '';
    alphabets.forEach(str => {
        allChars += str.replace(/[^a-zA-Z]/g, '');
    });
    
    // Reverse the string
    const reversed = allChars.split('').reverse().join('');
    
    // Apply alternating caps (starting with uppercase)
    let result = '';
    for (let i = 0; i < reversed.length; i++) {
        if (i % 2 === 0) {
            result += reversed[i].toUpperCase();
        } else {
            result += reversed[i].toLowerCase();
        }
    }
    
    return result;
}

// POST route for /bfhl
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
        // Validate input
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input: 'data' should be an array"
            });
        }

        // Initialize arrays
        const oddNumbers = [];
        const evenNumbers = [];
        const alphabets = [];
        const specialCharacters = [];
        let sum = 0;

        // Process each element in the data array
        data.forEach(item => {
            const str = String(item);
            
            if (isNumber(str)) {
                const num = parseInt(str);
                if (num % 2 === 0) {
                    evenNumbers.push(str);
                } else {
                    oddNumbers.push(str);
                }
                sum += num;
            } else if (isAlphabet(str)) {
                alphabets.push(str.toUpperCase());
            } else if (hasSpecialCharacters(str)) {
                // For mixed strings containing special characters
                if (/^[^a-zA-Z0-9]+$/.test(str)) {
                    // Pure special character string
                    specialCharacters.push(str);
                } else {
                    // Mixed string - extract numbers, alphabets, and special chars
                    const numbers = str.match(/\d+/g) || [];
                    const letters = str.match(/[a-zA-Z]+/g) || [];
                    const specials = str.match(/[^a-zA-Z0-9]+/g) || [];
                    
                    numbers.forEach(num => {
                        const n = parseInt(num);
                        if (n % 2 === 0) {
                            evenNumbers.push(num);
                        } else {
                            oddNumbers.push(num);
                        }
                        sum += n;
                    });
                    
                    letters.forEach(letter => {
                        alphabets.push(letter.toUpperCase());
                    });
                    
                    specials.forEach(special => {
                        specialCharacters.push(special);
                    });
                }
            }
        });

        // Create concatenation string with alternating caps
        const concatString = createAlternatingCaps(alphabets);

        // Response object
        const response = {
            is_success: true,
            user_id: "shreya_suresh_24092004", // Replace with your actual details
            email: "shreya.suresh2022@vitstudent.ac.in", // Replace with your actual email
            roll_number: "22BCE1264", // Replace with your actual roll number
            odd_numbers: oddNumbers,
            even_numbers: evenNumbers,
            alphabets: alphabets,
            special_characters: specialCharacters,
            sum: sum.toString(),
            concat_string: concatString
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// GET route for /bfhl (optional - for testing)
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: "BFHL API is running",
        endpoints: {
            post: "/bfhl - Process data array",
            get: "/bfhl - Get operation code"
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        is_success: false,
        error: "Something went wrong!"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;