// Helper functions
function isNumber(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function isAlphabet(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function hasSpecialCharacters(str) {
    return /[^a-zA-Z0-9]/.test(str);
}

function createAlternatingCaps(alphabets) {
    let allChars = '';
    alphabets.forEach(str => {
        allChars += str.replace(/[^a-zA-Z]/g, '');
    });
    
    const reversed = allChars.split('').reverse().join('');
    
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

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        res.status(200).json({
            operation_code: 1
        });
        return;
    }

    if (req.method === 'POST') {
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


            const concatString = createAlternatingCaps(alphabets);

            const response = {
                is_success: true,
                user_id: "shreya_suresh_24092004", 
                email: "shreya.suresh2022@vitstudent.ac.in", 
                roll_number: "22BCE1264",
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
    } else {
        res.status(405).json({
            error: "Method not allowed"
        });
    }
}